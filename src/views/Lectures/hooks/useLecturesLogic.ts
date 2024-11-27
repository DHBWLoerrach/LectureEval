import { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert } from 'react-native'
import { useAuth } from '~/context/AuthContext'
import { LectureType } from '~/enums/LectureType'
import { Role } from '~/enums/Role'
import { useCourseAssignmentsQuery } from '~/queries/CourseAssignments/useCourseAssignmentsQuery'
import { useDepartmentsQuery } from '~/queries/Departments/useDepartmentsQuery'
import { useLecturersQuery } from '~/queries/Lecturers/useLecturersQuery'
import { useLecturesQuery } from '~/queries/Lectures/useLecturesQuery'
import { useSemestersQuery } from '~/queries/Semesters/useSemestersQuery'
import { useStudentsQuery } from '~/queries/Students/useStudentsQuery'
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

    const {
        data: lecturers,
        isLoading: lecturersLoading,
        error: lecturersError,
    } = useLecturersQuery()
    const { data: students, isLoading: studentsLoading, error: studentsError } = useStudentsQuery()
    const { data: lectures, isLoading: lecturesLoading, error: lecturesError } = useLecturesQuery()
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
            studentsError ??
            lecturersError ??
            lecturesError ??
            courseAssignmentsError ??
            departmentsError ??
            semestersError,
        [
            studentsError,
            lecturersError,
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

    const courseMap = useMemo(
        () =>
            Object.fromEntries(
                students?.map((student) => [student.userID, student.courseID]) ?? [],
            ),
        [students],
    )

    const lecturerMap = useMemo(
        () =>
            Object.fromEntries(lecturers?.map((lecturer) => [lecturer.userID, lecturer.id]) ?? []),
        [lecturers],
    )

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

        const courseId = role === Role.Student ? userId && courseMap[userId] : undefined
        const lecturerId = role !== Role.Student ? userId && lecturerMap[userId] : undefined

        const lectureIds = courseAssignments
            ?.filter(
                (courseAssignment) =>
                    courseAssignment.courseID === courseId ||
                    courseAssignment.lecturerID === lecturerId,
            )
            .map((courseAssignment) => courseAssignment.lectureID)

        return lectures?.filter((lecture) => lectureIds?.includes(lecture.id)) ?? []
    }, [role, courseAssignments, lectures, userId, courseMap, lecturerMap])

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
            { value: LectureType.MyLectures, label: intl.formatMessage(translations.myLectures) },
            { value: LectureType.AllLectures, label: intl.formatMessage(translations.allLectures) },
        ],
        [intl],
    )

    const isLoading = useMemo(
        () =>
            lecturesLoading ||
            departmentsLoading ||
            semestersLoading ||
            lecturersLoading ||
            studentsLoading ||
            courseAssignmentsLoading,
        [
            lecturesLoading,
            departmentsLoading,
            semestersLoading,
            lecturersLoading,
            studentsLoading,
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
