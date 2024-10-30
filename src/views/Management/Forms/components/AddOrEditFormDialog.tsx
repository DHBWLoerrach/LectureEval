import React, { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Button, Dialog, Portal } from 'react-native-paper'
import SelectMenu from '~/components/SelectMenu'
import TextInput from '~/components/TextInput'
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
    const form = useForm<FormFormData>({
        defaultValues: initialData,
    })
    const {
        handleSubmit,
        formState: { isDirty },
    } = form

    const title = useMemo(
        () => (initialData ? 'Formular bearbeiten' : 'Formular hinzufügen'),
        [initialData],
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
                            label='Name'
                            rules={{ required: 'Bitte gib einen Namen ein.' }}
                        />
                        <SelectMenu
                            name='departmentID'
                            label='Studiengang'
                            options={options}
                            rules={{ required: 'Bitte wähle einen Studiengang aus.' }}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={onClose}>Abbrechen</Button>
                        <Button
                            disabled={!isDirty}
                            onPress={handleSubmit(onSave)}
                        >
                            Speichern
                        </Button>
                    </Dialog.Actions>
                </FormProvider>
            </Dialog>
        </Portal>
    )
}

export default AddOrEditFormDialog
