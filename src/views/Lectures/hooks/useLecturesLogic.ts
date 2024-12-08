import { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert } from 'react-native'
import { useAuth } from '~/context/AuthContext'
import { LectureType } from '~/enums/LectureType'
import { Role } from '~/enums/Role'
import { useCourseAssignmentsQuery } from '~/queries/CourseAssignments/useCourseAssignmentsQuery'
import { useDepartmentsQuery } from '~/queries/Departments/useDepartmentsQuery'
import { useLecturerByUserQuery } from '~/queries/Lecturers/useLecturerByUserQuery'
import { useLecturesQuery } from '~/queries/Lectures/useLecturesQuery'
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
            semestersError,
        [
            studentError,
            lecturerError,
            lecturesError,
            courseAssignmentsError,
            departmentsError,
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
            courseAssignmentsLoading,
        [
            lecturesLoading,
            departmentsLoading,
            semestersLoading,
            lecturerLoading,
            studentLoading,
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
    }
}
