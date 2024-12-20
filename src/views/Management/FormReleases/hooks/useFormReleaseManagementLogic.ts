import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert } from 'react-native'
import { useDialog } from '~/context/DialogContext'
import { useSnackbar } from '~/context/SnackbarContext'
import {
    CourseAssignmentWithLecture,
    useCourseAssignmentsWithLectureQuery,
} from '~/queries/CourseAssignments/useCourseAssignmentsWithLectureQuery'
import { useDeleteCourseAssignmentMutation } from '~/queries/CourseAssignments/useDeleteCourseAssignmentMutation'
import { useUpsertCourseAssignmentMutation } from '~/queries/CourseAssignments/useUpsertCourseAssignmentMutation'
import { useCoursesQuery } from '~/queries/Courses/useCoursesQuery'
import { useDepartmentsQuery } from '~/queries/Departments/useDepartmentsQuery'
import { useFormsQuery } from '~/queries/Forms/useFormsQuery'
import { translations } from '~/translations/translations'
import { CourseAssignment } from '~/types/CourseAssignment'
import { CourseAssignmentFormData } from '~/views/Management/FormReleases/types/CourseAssignmentFormData'

export const useFormReleaseManagementLogic = () => {
    const intl = useIntl()

    const showDialog = useDialog()
    const showSnackbar = useSnackbar()

    const [editInfo, setEditInfo] = useState<{ initialData?: CourseAssignment }>()

    const {
        data: departments,
        isLoading: departmentsLoading,
        error: departmentsError,
    } = useDepartmentsQuery()

    const { data: forms, isLoading: formsLoading, error: formsError } = useFormsQuery()

    const {
        data: assignments,
        isLoading: assignmentsLoading,
        error: assignmentsError,
        refetch: refetchAssignments,
    } = useCourseAssignmentsWithLectureQuery()

    const { data: courses, isLoading: coursesLoading, error: coursesError } = useCoursesQuery()

    const { mutate: upsertCourseAssignment } = useUpsertCourseAssignmentMutation()
    const { mutate: deleteCourseAssignment } = useDeleteCourseAssignmentMutation()

    const onSave = useCallback(
        (assignment: CourseAssignmentFormData) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore because some joined data might still exist
            delete assignment.lecture

            upsertCourseAssignment(assignment, {
                onSuccess: () => {
                    refetchAssignments()
                    setEditInfo(undefined)
                    showSnackbar({
                        text: assignment.lectureID
                            ? intl.formatMessage(translations.changesSaved)
                            : intl.formatMessage(translations.entityCreated, {
                                  article: intl.formatMessage(translations.femaleArticle),
                                  entity: intl.formatMessage(translations.formRelease),
                              }),
                    })
                },
                onError: (error) => {
                    Alert.alert(
                        intl.formatMessage(translations.error),
                        intl.formatMessage(translations.errorDescription),
                    )
                    console.error(
                        `Unexpected error while saving a course assignment: ${error.message}`,
                    )
                },
            })
        },
        [upsertCourseAssignment, refetchAssignments, showSnackbar, intl],
    )

    const onClose = useCallback(() => setEditInfo(undefined), [setEditInfo])

    const onDelete = useCallback(
        (assignment: CourseAssignmentWithLecture) => {
            showDialog({
                title: intl.formatMessage(translations.deleteEntityHeader, {
                    entity: intl.formatMessage(translations.formRelease),
                }),
                description: intl.formatMessage(translations.deleteEntityDescription, {
                    name: assignment.lecture.name,
                }),
                onAccept: () =>
                    deleteCourseAssignment(assignment.id, {
                        onSuccess: () => {
                            refetchAssignments()
                            showSnackbar({
                                text: intl.formatMessage(translations.entityDeleted, {
                                    article: intl.formatMessage(translations.femaleArticle),
                                    entity: intl.formatMessage(translations.formRelease),
                                }),
                            })
                        },
                        onError: (error) => {
                            Alert.alert(
                                intl.formatMessage(translations.error),
                                intl.formatMessage(translations.errorDescription),
                            )
                            console.error(
                                `Unexpected error while deleting a course assignment: ${error.message}`,
                            )
                        },
                    }),
            })
        },
        [showDialog, deleteCourseAssignment, refetchAssignments, showSnackbar, intl],
    )

    const onEdit = useCallback(
        (assignment: CourseAssignment) => setEditInfo({ initialData: assignment }),
        [],
    )
    const onCreate = useCallback(() => setEditInfo({}), [])

    useEffect(() => {
        if (!assignmentsError && !formsError && !departmentsError && !coursesError) return

        Alert.alert(
            intl.formatMessage(translations.error),
            intl.formatMessage(translations.errorDescription),
        )
        console.error(
            assignmentsError?.message ??
                formsError?.message ??
                departmentsError?.message ??
                coursesError?.message,
        )
    }, [assignmentsError, formsError, departmentsError, intl, coursesError])

    const loading = useMemo(
        () => assignmentsLoading || formsLoading || departmentsLoading || coursesLoading,
        [assignmentsLoading, formsLoading, departmentsLoading, coursesLoading],
    )

    return {
        assignments,
        editInfo,
        forms,
        departments,
        courses,
        loading,
        onDelete,
        onEdit,
        onCreate,
        onSave,
        onClose,
    }
}
