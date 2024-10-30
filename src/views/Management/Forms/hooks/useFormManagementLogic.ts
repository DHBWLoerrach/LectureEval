import { useMutation, useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useDialog } from '~/context/DialogContext'
import { useSnackbar } from '~/context/SnackbarContext'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { FormFormData } from '~/views/Management/Forms/types/AddOrEditFormData'
import { Department } from '~/views/Management/Forms/types/Department'
import { Form } from '~/views/Management/Forms/types/Form'

export const useFormManagementLogic = () => {
    const showDialog = useDialog()
    const showSnackbar = useSnackbar()

    const [editInfo, setEditInfo] = useState<{ initialData?: Form }>()

    const {
        data: departments,
        isLoading: departmentsLoading,
        error: departmentsError,
    } = useQuery<Department[]>({
        queryKey: [Table.Departments],
        queryFn: useCallback(async () => {
            const { data } = await supabase.from(Table.Departments).select('*').throwOnError()

            return data ?? []
        }, []),
    })

    const {
        data: forms,
        isLoading: formsLoading,
        error: formsError,
        refetch: refetchForms,
    } = useQuery<Form[]>({
        queryKey: [Table.Forms],
        queryFn: useCallback(async () => {
            const { data } = await supabase.from(Table.Forms).select('*').throwOnError()

            return data ?? []
        }, []),
    })

    const { mutate: deleteForm } = useMutation({
        mutationFn: useCallback(
            async (id: number) => {
                await supabase.from(Table.Forms).delete().eq('id', id).throwOnError()

                refetchForms()
                showSnackbar({
                    text: 'Das Formular wurde gelöscht.',
                })
            },
            [refetchForms, showSnackbar],
        ),
    })

    const { mutate: saveForm } = useMutation({
        mutationFn: useCallback(
            async (form: FormFormData) => {
                await supabase.from(Table.Forms).upsert(form).throwOnError()

                refetchForms()
                showSnackbar({
                    text: form.id
                        ? 'Die Änderungen wurden gespeichert.'
                        : 'Das Formular wurde erstellt.',
                })
            },
            [refetchForms, showSnackbar],
        ),
    })

    const onSave = useCallback(
        (form: FormFormData) =>
            saveForm(form, {
                onError: (error) => {
                    Alert.alert('Fehler', 'Fehler beim Speichern des Formulars.')
                    console.error(`Unexpected error while saving a form: ${error.message}`)
                },
            }),
        [saveForm],
    )
    const onClose = useCallback(() => setEditInfo(undefined), [setEditInfo])

    const onDelete = useCallback(
        (form: Form) => {
            showDialog({
                title: 'Formular löschen?',
                description: `"${form.name}" wird unwiderruflich gelöscht.`,
                onAccept: () =>
                    deleteForm(form.id, {
                        onError: (error) => {
                            Alert.alert('Fehler', 'Fehler beim Löschen des Formulars.')
                            console.error(
                                `Unexpected error while deleting a form: ${error.message}`,
                            )
                        },
                    }),
            })
        },
        [showDialog, deleteForm],
    )
    const onEdit = useCallback((form: Form) => setEditInfo({ initialData: form }), [])
    const onCreate = useCallback(() => setEditInfo({}), [])

    useEffect(() => {
        if (!formsError && !departmentsError) return

        Alert.alert('Fehler', 'Fehler beim Laden der Daten.')
        console.error(formsError?.message ?? departmentsError?.message)
    }, [formsError, departmentsError])

    return {
        forms,
        editInfo,
        departments,
        loading: formsLoading || departmentsLoading,
        onDelete,
        onEdit,
        onCreate,
        onSave,
        onClose,
    }
}
