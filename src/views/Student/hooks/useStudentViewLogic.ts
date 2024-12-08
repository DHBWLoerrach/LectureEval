import { useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { Alert } from 'react-native'
import { useAuth } from '~/context/AuthContext'
import { useAssignedLecturesForCourseQuery } from '~/queries/CourseAssignments/useAssignedLecturesForCourseQuery'
import { usePendingRatingsByStudentQuery } from '~/queries/PendingRatings/usePendingRatingsByStudentQuery'
import { useSemestersQuery } from '~/queries/Semesters/useSemestersQuery'
import { useStudentByUserQuery } from '~/queries/Students/useStudentByUserQuery'
import { translations } from '~/translations/translations'
import { StudentViewType } from '~/views/Student/types/StudentViewType'

export const useStudentViewLogic = () => {
    const intl = useIntl()
    const { session } = useAuth()

    const {
        data: student,
        isLoading: studentLoading,
        error: studentError,
    } = useStudentByUserQuery({ userID: session?.user.id })

    const {
        data: pendingRatings,
        isLoading: pendingRatingsLoading,
        error: pendingRatingsError,
    } = usePendingRatingsByStudentQuery({ studentID: student?.id })

    const {
        data: lectures,
        isLoading: lecturesLoading,
        error: lecturesError,
    } = useAssignedLecturesForCourseQuery({ courseID: student?.courseID })

    const {
        data: semesters,
        isLoading: semestersLoading,
        error: semestersError,
    } = useSemestersQuery()

    const pendingLectures = useMemo(() => {
        return (
            lectures?.filter((l) => {
                const rating = pendingRatings?.find((r) => r.courseAssignmentID === l.id)

                return !!rating
            }) ?? []
        )
    }, [lectures, pendingRatings])

    const ratedLectures = useMemo(() => {
        return (
            lectures?.filter((l) => {
                const rating = pendingRatings?.find((r) => r.courseAssignmentID === l.id)

                return !rating
            }) ?? []
        )
    }, [lectures, pendingRatings])

    const isLoading = useMemo(
        () => studentLoading || pendingRatingsLoading || lecturesLoading || semestersLoading,
        [lecturesLoading, pendingRatingsLoading, semestersLoading, studentLoading],
    )

    const error = useMemo(
        () => studentError || pendingRatingsError || lecturesError || semestersError,
        [lecturesError, pendingRatingsError, semestersError, studentError],
    )

    useEffect(() => {
        if (!error) return

        Alert.alert(
            intl.formatMessage(translations.error),
            intl.formatMessage(translations.errorDescription),
        )

        console.error(error.message)
    }, [error, intl])

    const viewButtons = useMemo(
        () => [
            {
                label: intl.formatMessage(translations.pending),
                value: StudentViewType.PendingRatings,
            },
            {
                label: intl.formatMessage(translations.rated),
                value: StudentViewType.RatedLectures,
            },
        ],
        [intl],
    )

    return {
        semesters: semesters ?? [],
        isLoading,
        viewButtons,
        ratedLectures,
        pendingLectures,
    }
}
