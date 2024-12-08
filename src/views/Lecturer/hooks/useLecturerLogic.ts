import { useCallback, useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { Alert } from 'react-native'
import { useAuth } from '~/context/AuthContext'
import { QuestionType } from '~/enums/QuestionType'
import { convertToFiveStars } from '~/helpers/convertToFiveStars'
import { useCourseAssignmentsByLecturerQuery } from '~/queries/CourseAssignments/useCourseAssignmentsByLecturerQuery'
import { useCoursesByIDQuery } from '~/queries/Courses/useCoursesByIDQuery'
import { useDepartmentsByIDQuery } from '~/queries/Departments/useDepartmentsByIDQuery'
import { useFormValuesByAssignmentsQuery } from '~/queries/FormValues/useFormValuesByAssignmentsQuery'
import { useLecturerByUserQuery } from '~/queries/Lecturers/useLecturerByUserQuery'
import { useLecturesByIDQuery } from '~/queries/Lectures/useLecturesByIDQuery'
import { useQuestionsByIDQuery } from '~/queries/Questions/useQuestionsByIDQuery'
import { useSemestersByIDQuery } from '~/queries/Semesters/useSemestersByIDQuery'
import { translations } from '~/translations/translations'
import { useLectureFilterLogic } from '~/views/Lectures/hooks/useLectureFilterLogic'

export const useLecturerLogic = () => {
    const intl = useIntl()
    const { session } = useAuth()
    const userId = useMemo(() => session?.user.id, [session])

    const {
        data: lecturer,
        isLoading: lecturerLoading,
        error: lecturerError,
    } = useLecturerByUserQuery({ userId })

    const {
        data: courseAssignments,
        isLoading: courseAssignmentsLoading,
        error: courseAssignmentsError,
    } = useCourseAssignmentsByLecturerQuery({ lecturerID: lecturer?.id })

    const lectureIDs = useMemo(
        () => courseAssignments?.map((courseAssignment) => courseAssignment.lectureID),
        [courseAssignments],
    )

    const {
        data: lectures,
        isLoading: lecturesLoading,
        error: lecturesError,
    } = useLecturesByIDQuery({ lectureIDs })

    const courseIDs = useMemo(
        () => courseAssignments?.map((courseAssignment) => courseAssignment.courseID),
        [courseAssignments],
    )

    const {
        data: courses,
        isLoading: coursesLoading,
        error: coursesError,
    } = useCoursesByIDQuery({ courseIDs })

    const departmentIDs = useMemo(
        () => lectures?.map((lecture) => lecture.departmentID),
        [lectures],
    )

    const {
        data: departments,
        isLoading: departmentsLoading,
        error: departmentsError,
    } = useDepartmentsByIDQuery({ departmentIDs })

    const semesterIDs = useMemo(() => lectures?.map((lecture) => lecture.semesterID), [lectures])

    const {
        data: semesters,
        isLoading: semestersLoading,
        error: semestersError,
    } = useSemestersByIDQuery({ semesterIDs })

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
        lectures: lectures ?? [],
        departments: departments ?? [],
    })

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

            const groupedByAssignment =
                filteredFormValues?.reduce(
                    (acc, formValue) => {
                        if (!acc[formValue.courseAssignmentID]) {
                            acc[formValue.courseAssignmentID] = []
                        }
                        acc[formValue.courseAssignmentID].push(formValue.value)

                        return acc
                    },
                    {} as Record<string, string[]>,
                ) ?? {}

            return Object.fromEntries(
                Object.entries(groupedByAssignment).map(([assignmentId, values]) => {
                    const intValues = values
                        .map((value) => parseInt(value, 10))
                        .filter((num) => !isNaN(num))

                    const average =
                        intValues.length > 0
                            ? questionType === QuestionType.Rating
                                ? convertToFiveStars(
                                      intValues.reduce((sum, num) => sum + num, 0) /
                                          intValues.length,
                                  )
                                : intValues.reduce((sum, num) => sum + num, 0) / intValues.length
                            : null

                    return [assignmentId, average ?? intl.formatMessage(translations.notSet)]
                }),
            )
        },
        [getFilteredFormValues, intl],
    )

    const ratingAverages = useMemo(
        () => getFormValueAverages(QuestionType.Rating),
        [getFormValueAverages],
    )
    const difficultyAverages = useMemo(
        () => getFormValueAverages(QuestionType.Difficulty),
        [getFormValueAverages],
    )

    const error = useMemo(
        () =>
            lecturerError ??
            lecturesError ??
            courseAssignmentsError ??
            departmentsError ??
            coursesError ??
            formValuesError ??
            questionsError ??
            semestersError,
        [
            lecturerError,
            lecturesError,
            courseAssignmentsError,
            departmentsError,
            coursesError,
            formValuesError,
            questionsError,
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

    const courseMap = useMemo(
        () => Object.fromEntries(courses?.map((course) => [course.id, course.name]) ?? []),
        [courses],
    )

    const isLoading = useMemo(
        () =>
            lecturesLoading ||
            departmentsLoading ||
            semestersLoading ||
            lecturerLoading ||
            courseAssignmentsLoading ||
            formValuesLoading ||
            questionsLoading ||
            coursesLoading,
        [
            lecturesLoading,
            departmentsLoading,
            semestersLoading,
            lecturerLoading,
            courseAssignmentsLoading,
            formValuesLoading,
            questionsLoading,
            coursesLoading,
        ],
    )

    return {
        search,
        setSearch,
        searchedLectures,
        courseAssignments,
        ratingAverages,
        difficultyAverages,
        isLoading,
        departmentMap,
        semesterMap,
        courseMap,
    }
}
