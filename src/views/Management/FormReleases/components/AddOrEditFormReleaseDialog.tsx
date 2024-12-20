import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Alert, StyleSheet } from 'react-native'
import { Dialog, Portal } from 'react-native-paper'
import Button from '~/components/Button'
import DateInput from '~/components/DateInput'
import LoadingSpinner from '~/components/LoadingSpinner'
import SelectMenu from '~/components/SelectMenu'
import { useLocale } from '~/context/LocaleContext'
import { CourseAssignmentWithLecture } from '~/queries/CourseAssignments/useCourseAssignmentsWithLectureQuery'
import { useLecturersQuery } from '~/queries/Lecturers/useLecturersQuery'
import { useLecturesQuery } from '~/queries/Lectures/useLecturesQuery'
import { globalStyles } from '~/styles/globalStyles'
import { translations } from '~/translations/translations'
import { Course } from '~/types/Course'
import { CourseAssignment } from '~/types/CourseAssignment'
import { Form } from '~/types/Form'
import { CourseAssignmentFormData } from '~/views/Management/FormReleases/types/CourseAssignmentFormData'

type Props = {
    assignments: CourseAssignmentWithLecture[] | undefined
    onSave: (formData: CourseAssignmentFormData) => void
    onClose: () => void
    initialData?: CourseAssignment
    forms: Form[]
    courses: Course[]
}

const styles = StyleSheet.create({
    content: { gap: 10 },
})

const AddOrEditFormReleaseDialog = ({
    assignments,
    onClose,
    onSave,
    initialData,
    forms,
    courses,
}: Props) => {
    const intl = useIntl()
    const { locale } = useLocale()

    const form = useForm<CourseAssignmentFormData>({
        defaultValues: initialData,
    })
    const {
        watch,
        trigger,
        handleSubmit,
        formState: { isDirty },
    } = form

    const selectedFormID = watch('formID')
    const selectedCourseID = watch('courseID')
    const selectedLectureID = watch('lectureID')

    const today = useMemo(() => new Date().toLocaleDateString('de-DE'), [])

    const alreadyReleased = useMemo(
        () => !!initialData && initialData.releaseDate <= today,
        [initialData, today],
    )

    useEffect(() => {
        if (!isDirty) return

        trigger()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale])

    const title = useMemo(
        () =>
            initialData
                ? intl.formatMessage(translations.editEntityHeader, {
                      entity: intl.formatMessage(translations.formRelease),
                  })
                : intl.formatMessage(translations.createEntityHeader, {
                      entity: intl.formatMessage(translations.formRelease),
                  }),
        [initialData, intl],
    )

    const formOptions = useMemo(() => {
        return (
            forms?.map((form) => ({
                label: form.name,
                value: form.id,
            })) ?? []
        )
    }, [forms])

    const courseOptions = useMemo(() => {
        const departmentID = forms.find((form) => form.id === selectedFormID)?.departmentID

        if (!departmentID) return []

        const existingAssignments = selectedLectureID
            ? (assignments?.filter((ass) => ass.lectureID === selectedLectureID) ?? [])
            : []

        return (
            courses
                ?.filter(
                    (course) =>
                        course?.departmentID === departmentID &&
                        !existingAssignments.find((ass) => ass.courseID === course.id),
                ) // Filter courses by departmentID
                .map((sem) => ({
                    label: sem.name,
                    value: sem.id,
                })) ?? []
        )
    }, [courses, selectedFormID, forms, assignments, selectedLectureID])

    const { data: lectures, isLoading: lecturesLoading, error: lecturesError } = useLecturesQuery()
    const lectureOptions = useMemo(() => {
        const departmentID = forms.find((form) => form.id === selectedFormID)?.departmentID

        if (!departmentID) return []

        const existingAssignments = selectedCourseID
            ? (assignments?.filter((ass) => ass.courseID === selectedCourseID) ?? [])
            : []

        return (
            lectures
                ?.filter(
                    (lecture) =>
                        lecture.departmentID === departmentID &&
                        !existingAssignments.find((ass) => ass.lectureID === lecture.id),
                )
                .map((lecture) => ({
                    label: lecture.name,
                    value: lecture.id,
                })) ?? []
        )
    }, [lectures, selectedFormID, forms, assignments, selectedCourseID])

    const {
        data: lecturers,
        isLoading: lecturersLoading,
        error: lecturersError,
    } = useLecturersQuery()
    const lecturerOptions = useMemo(() => {
        return (
            lecturers?.map((lecturer) => ({
                label: `${lecturer.firstName} ${lecturer.lastName}`,
                value: lecturer.id,
            })) ?? []
        )
    }, [lecturers])

    useEffect(() => {
        if (!lecturersError && !lecturesError) return

        Alert.alert(
            intl.formatMessage(translations.error),
            intl.formatMessage(translations.errorDescription),
        )
        console.error(lecturersError?.message ?? lecturesError?.message)
    }, [lecturersError, lecturesError, intl])

    return (
        <Portal>
            <Dialog
                visible
                onDismiss={onClose}
                style={globalStyles.dialog}
            >
                {(lecturesLoading || lecturersLoading) && <LoadingSpinner />}
                {!lecturesLoading && !lecturersLoading && (
                    <FormProvider {...form}>
                        <Dialog.Title>{title}</Dialog.Title>
                        <Dialog.Content style={styles.content}>
                            <SelectMenu
                                name='formID'
                                label={intl.formatMessage(translations.form)}
                                options={formOptions}
                                rules={{ required: intl.formatMessage(translations.required) }}
                                disabled={alreadyReleased}
                            />
                            <SelectMenu
                                name='courseID'
                                label={intl.formatMessage(translations.course)}
                                options={courseOptions}
                                rules={{ required: intl.formatMessage(translations.required) }}
                                disabled={!selectedFormID || alreadyReleased}
                            />
                            <SelectMenu
                                name='lectureID'
                                label={intl.formatMessage(translations.lecture)}
                                options={lectureOptions}
                                rules={{ required: intl.formatMessage(translations.required) }}
                                disabled={!selectedFormID || alreadyReleased}
                            />
                            <SelectMenu
                                name='lecturerID'
                                label={intl.formatMessage(translations.lecturer)}
                                options={lecturerOptions}
                                rules={{ required: intl.formatMessage(translations.required) }}
                                disabled={!selectedFormID || alreadyReleased}
                            />
                            <DateInput
                                name='releaseDate'
                                label={intl.formatMessage(translations.startDate)}
                                rules={{
                                    required: intl.formatMessage(translations.required),
                                }}
                                disabled={!selectedFormID || alreadyReleased}
                            />
                            <DateInput
                                name='recallDate'
                                label={intl.formatMessage(translations.endDate)}
                                rules={{
                                    required: intl.formatMessage(translations.required),
                                }}
                                disabled={!selectedFormID}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={onClose}>
                                {intl.formatMessage(translations.cancel)}
                            </Button>
                            <Button
                                disabled={!isDirty}
                                onPress={handleSubmit(onSave)}
                            >
                                {intl.formatMessage(translations.save)}
                            </Button>
                        </Dialog.Actions>
                    </FormProvider>
                )}
            </Dialog>
        </Portal>
    )
}

export default AddOrEditFormReleaseDialog
