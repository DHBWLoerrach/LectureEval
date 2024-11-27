import { useCallback, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { StyleSheet } from 'react-native'
import { Dialog, Portal } from 'react-native-paper'
import Button from '~/components/Button'
import SelectMenu from '~/components/SelectMenu'
import TextInput from '~/components/TextInput'
import { useLocale } from '~/context/LocaleContext'
import { globalStyles } from '~/styles/globalStyles'
import { translations } from '~/translations/translations'
import { Course } from '~/types/Course'
import { Department } from '~/types/Department'
import { CourseFormData } from '~/views/Management/Courses/types/CourseFormData'

type Props = {
    courses: Course[] | undefined
    onSave: (formData: CourseFormData) => void
    onClose: () => void
    initialData?: Course
    departments: Department[]
}

const styles = StyleSheet.create({
    content: { gap: 10 },
})

const AddOrEditCourseDialog = ({ courses, onClose, onSave, initialData, departments }: Props) => {
    const intl = useIntl()
    const { locale } = useLocale()

    const form = useForm<CourseFormData>({
        defaultValues: initialData,
    })
    const {
        watch,
        trigger,
        handleSubmit,
        formState: { isDirty },
    } = form

    useEffect(() => {
        if (!isDirty) return

        trigger()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale])

    const title = useMemo(
        () =>
            initialData
                ? intl.formatMessage(translations.editEntityHeader, {
                      entity: intl.formatMessage(translations.course),
                  })
                : intl.formatMessage(translations.createEntityHeader, {
                      entity: intl.formatMessage(translations.course),
                  }),
        [initialData, intl],
    )

    const departmentOptions = useMemo(() => {
        return (
            departments?.map((dep) => ({
                label: dep.name,
                value: dep.id,
            })) ?? []
        )
    }, [departments])

    const validateName = useCallback(
        (name: string) => {
            const departmentID = watch('departmentID')

            const nameTaken = courses?.reduce((exists, course) => {
                if (course.name.toLowerCase().localeCompare(name.toLowerCase()) !== 0) return exists

                if (course.name === initialData?.name) return exists

                if (course.departmentID !== departmentID) return exists

                return true
            }, false)

            if (!nameTaken) return

            return intl.formatMessage(translations.courseNameExists)
        },
        [watch, courses, intl, initialData?.name],
    )

    return (
        <Portal>
            <Dialog
                visible
                onDismiss={onClose}
                style={globalStyles.dialog}
            >
                <FormProvider {...form}>
                    <Dialog.Title>{title}</Dialog.Title>
                    <Dialog.Content style={styles.content}>
                        <TextInput
                            name='name'
                            label={intl.formatMessage(translations.name)}
                            rules={{
                                required: intl.formatMessage(translations.required),
                                validate: validateName,
                            }}
                        />
                        <SelectMenu
                            name='departmentID'
                            label={intl.formatMessage(translations.department)}
                            options={departmentOptions}
                            rules={{ required: intl.formatMessage(translations.required) }}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={onClose}>{intl.formatMessage(translations.cancel)}</Button>
                        <Button
                            disabled={!isDirty}
                            onPress={handleSubmit(onSave)}
                        >
                            {intl.formatMessage(translations.save)}
                        </Button>
                    </Dialog.Actions>
                </FormProvider>
            </Dialog>
        </Portal>
    )
}

export default AddOrEditCourseDialog
