import React, { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Button, Dialog, Portal } from 'react-native-paper'
import SelectMenu from '~/components/SelectMenu'
import TextInput from '~/components/TextInput'
import { useLocale } from '~/context/LocaleContext'
import { translations } from '~/translations/translations'
import { FormFormData } from '~/views/Management/Forms/types/AddOrEditFormData'
import { Department } from '~/views/Management/Forms/types/Department'
import { Form } from '~/views/Management/Forms/types/Form'

type Props = {
    onSave: (formData: FormFormData) => void
    onClose: () => void
    initialData?: Form
    departments: Department[]
}

const AddOrEditFormDialog = ({ onClose, onSave, initialData, departments }: Props) => {
    const intl = useIntl()
    const { locale } = useLocale()

    const form = useForm<FormFormData>({
        defaultValues: initialData,
    })
    const {
        trigger,
        handleSubmit,
        formState: { isDirty },
    } = form

    useEffect(() => {
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

    return (
        <Portal>
            <Dialog
                visible
                onDismiss={onClose}
            >
                <FormProvider {...form}>
                    <Dialog.Title>{title}</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            name='name'
                            label={intl.formatMessage(translations.name)}
                            rules={{ required: intl.formatMessage(translations.required) }}
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
