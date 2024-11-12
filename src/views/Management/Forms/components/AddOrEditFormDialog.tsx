import { useCallback, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { StyleSheet } from 'react-native'
import { Button, Dialog, Portal } from 'react-native-paper'
import SelectMenu from '~/components/SelectMenu'
import TextInput from '~/components/TextInput'
import { useLocale } from '~/context/LocaleContext'
import { translations } from '~/translations/translations'
import { Department } from '~/types/Department'
import { Form } from '~/types/Form'
import { FormFormData } from '~/views/Management/Forms/types/FormFormData'

type Props = {
    forms: Form[] | undefined
    onSave: (formData: FormFormData) => void
    onClose: () => void
    initialData?: Form
    departments: Department[]
}

const styles = StyleSheet.create({
    content: { gap: 10 },
})

const AddOrEditFormDialog = ({ forms, onClose, onSave, initialData, departments }: Props) => {
    const intl = useIntl()
    const { locale } = useLocale()

    const form = useForm<FormFormData>({
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
                      entity: intl.formatMessage(translations.form),
                  })
                : intl.formatMessage(translations.createEntityHeader, {
                      entity: intl.formatMessage(translations.form),
                  }),
        [initialData, intl],
    )

    const options = useMemo(() => {
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

            const nameTaken = forms?.reduce((exists, form) => {
                if (form.name.localeCompare(name)) return exists

                // The form itself should be allowed to have its name
                if (form.id === initialData?.id) return exists

                // Forms may have the same name if they are in different departments
                if (form.departmentID !== departmentID) return exists

                return true
            }, false)

            if (!nameTaken) return

            return intl.formatMessage(translations.formNameExists)
        },
        [forms, initialData?.id, intl, watch],
    )

    return (
        <Portal>
            <Dialog
                visible
                onDismiss={onClose}
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
                            options={options}
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

export default AddOrEditFormDialog
