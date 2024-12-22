import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert } from 'react-native'
import { useAuth } from '~/context/AuthContext'
import { LectureType } from '~/enums/LectureType'
import { QuestionType } from '~/enums/QuestionType'
import { Role } from '~/enums/Role'
import { roundToTwoDigits } from '~/helpers/roundToTwoDigits'
import { useCourseAssignmentsQuery } from '~/queries/CourseAssignments/useCourseAssignmentsQuery'
import { useDepartmentsQuery } from '~/queries/Departments/useDepartmentsQuery'
import { useFormValuesByAssignmentsQuery } from '~/queries/FormValues/useFormValuesByAssignmentsQuery'
import { useLecturerByUserQuery } from '~/queries/Lecturers/useLecturerByUserQuery'
import { useLecturesQuery } from '~/queries/Lectures/useLecturesQuery'
import { useQuestionsByIDQuery } from '~/queries/Questions/useQuestionsByIDQuery'
import { useSemestersQuery } from '~/queries/Semesters/useSemestersQuery'
import { useStudentByUserQuery } from '~/queries/Students/useStudentByUserQuery'
import { translations } from '~/translations/translations'
import { Lecture } from '~/types/Lecture'
import { useLectureFilterLogic } from '~/views/Lectures/hooks/useLectureFilterLogic'

export const useLecturesLogic = () => {
    const intl = useIntl()
    const [lectureView, setLectureView] = useState<LectureType>(LectureType.MyLectures)
    const [filteredLectures, setFilteredLectures] = useState<Lecture[]>()
    const [showButton, setShowButton] = useState(true)

    const { role, session } = useAuth()
    const userId = useMemo(() => session?.user.id, [session])

    const { data: lectures, isLoading: lecturesLoading, error: lecturesError } = useLecturesQuery()

    const {
        data: lecturer,
        isLoading: lecturerLoading,
        error: lecturerError,
    } = useLecturerByUserQuery({ userId: userId, enabled: role === Role.Lecturer })

    const {
        data: student,
        isLoading: studentLoading,
        error: studentError,
    } = useStudentByUserQuery({ userID: userId, enabled: role === Role.Student })

    const {
        data: courseAssignments,
        isLoading: courseAssignmentsLoading,
        error: courseAssignmentsError,
    } = useCourseAssignmentsQuery()

    const {
        data: departments,
        isLoading: departmentsLoading,
        error: departmentsError,
    } = useDepartmentsQuery()

    const {
        data: semesters,
        isLoading: semestersLoading,
        error: semestersError,
    } = useSemestersQuery()

    const courseAssignmentIDs = useMemo(
        () => courseAssignments?.map((courseAssignment) => courseAssignment.id),
        [courseAssignments],
    )

    const {
        data: formValues,
        isLoading: formValuesLoading,
        error: formValuesError,
    } = useFormValuesByAssignmentsQuery({ courseAssignmentIDs })

    const questionIDs = useMemo(
        () => formValues?.map((formValue) => formValue.questionID),
        [formValues],
    )

    const {
        data: questions,
        isLoading: questionsLoading,
        error: questionsError,
    } = useQuestionsByIDQuery({ questionIDs })

    const { searchedLectures, search, setSearch } = useLectureFilterLogic({
        lectures: filteredLectures ?? [],
        departments: departments ?? [],
    })

    const error = useMemo(
        () =>
            studentError ??
            lecturerError ??
            lecturesError ??
            courseAssignmentsError ??
            departmentsError ??
            questionsError ??
            formValuesError ??
            semestersError,
        [
            studentError,
            lecturerError,
            lecturesError,
            courseAssignmentsError,
            departmentsError,
            questionsError,
            formValuesError,
            semestersError,
        ],
    )

    useEffect(() => {
        if (!error) return

        Alert.alert(
            intl.formatMessage(translations.error),
            intl.formatMessage(translations.errorDescription),
        )

        console.error(error.message)
    }, [error, intl])

    const departmentMap = useMemo(
        () =>
            Object.fromEntries(
                departments?.map((department) => [department.id, department.name]) ?? [],
            ),
        [departments],
    )

    const semesterMap = useMemo(
        () => Object.fromEntries(semesters?.map((semester) => [semester.id, semester.name]) ?? []),
        [semesters],
    )

    const courseAssignmentToLectureMap = useMemo(
        () =>
            Object.fromEntries(
                courseAssignments?.map((assignment) => [assignment.id, assignment.lectureID]) ?? [],
            ),
        [courseAssignments],
    )

    const userLectures = useMemo(() => {
        if (role === Role.Admin) return []

        const lectureIds = courseAssignments
            ?.filter(
                (courseAssignment) =>
                    courseAssignment.courseID === student?.courseID ||
                    courseAssignment.lecturerID === lecturer?.id,
            )
            .map((courseAssignment) => courseAssignment.lectureID)

        return lectures?.filter((lecture) => lectureIds?.includes(lecture.id)) ?? []
    }, [role, courseAssignments, lectures, student?.courseID, lecturer?.id])

    const getFilteredFormValues = useCallback(
        (questionType: QuestionType) => {
            if (!formValues || !questions) return []

            const questionTypeMap = new Map(
                questions.map((question) => [question.id, question.typeID]),
            )

            return formValues.filter(
                (formValue) => questionTypeMap.get(formValue.questionID) === questionType,
            )
        },
        [formValues, questions],
    )

    const getFormValueAverages = useCallback(
        (questionType: QuestionType) => {
            const filteredFormValues = getFilteredFormValues(questionType)

            const groupedByLecture =
                filteredFormValues.reduce(
                    (acc, formValue) => {
                        const lectureID = courseAssignmentToLectureMap[formValue.courseAssignmentID]
                        if (!lectureID) {
                            console.warn(
                                `No lectureID found for courseAssignmentID: ${formValue.courseAssignmentID}`,
                            )
                            return acc
                        }

                        if (!acc[lectureID]) {
                            acc[lectureID] = []
                        }
                        acc[lectureID].push(formValue.value)

                        return acc
                    },
                    {} as Record<number, string[]>,
                ) ?? {}

            return Object.fromEntries(
                Object.entries(groupedByLecture).map(([lectureID, values]) => {
                    const intValues = values
                        .map((value) => parseInt(value, 10))
                        .filter((num) => !isNaN(num))

                    const average =
                        intValues.length > 0
                            ? questionType === QuestionType.Result ||
                              questionType === QuestionType.Difficulty
                                ? roundToTwoDigits(
                                      intValues.reduce((sum, num) => sum + num, 0) /
                                          intValues.length,
                                  )
                                : intValues.reduce((sum, num) => sum + num, 0) / intValues.length
                            : null

                    return [lectureID, average ?? intl.formatMessage(translations.notSet)]
                }),
            )
        },
        [courseAssignmentToLectureMap, getFilteredFormValues, intl],
    )

    const ratingAverages = useMemo(
        () => getFormValueAverages(QuestionType.Result),
        [getFormValueAverages],
    )
    const difficultyAverages = useMemo(
        () => getFormValueAverages(QuestionType.Difficulty),
        [getFormValueAverages],
    )

    useEffect(() => {
        if (role === Role.Admin) {
            setLectureView(LectureType.AllLectures)
            setShowButton(false)
        } else {
            setShowButton(true)
        }
    }, [role])

    useEffect(() => {
        setFilteredLectures(lectureView === LectureType.MyLectures ? userLectures : lectures)
    }, [lectureView, lectures, userLectures])

    const buttons = useMemo(
        () => [
            { value: LectureType.MyLectures, label: intl.formatMessage(translations.my) },
            { value: LectureType.AllLectures, label: intl.formatMessage(translations.all) },
        ],
        [intl],
    )

    const isLoading = useMemo(
        () =>
            lecturesLoading ||
            departmentsLoading ||
            semestersLoading ||
            lecturerLoading ||
            studentLoading ||
            questionsLoading ||
            formValuesLoading ||
            courseAssignmentsLoading,
        [
            lecturesLoading,
            departmentsLoading,
            semestersLoading,
            lecturerLoading,
            studentLoading,
            questionsLoading,
            formValuesLoading,
            courseAssignmentsLoading,
        ],
    )

    return {
        lectureView,
        setLectureView,
        showButton,
        buttons,
        search,
        setSearch,
        searchedLectures,
        isLoading,
        departmentMap,
        semesterMap,
        ratingAverages,
        difficultyAverages,
    }
}
