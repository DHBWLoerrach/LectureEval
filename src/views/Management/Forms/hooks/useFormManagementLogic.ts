import { useMutation, useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert } from 'react-native'
import { useDialog } from '~/context/DialogContext'
import { useSnackbar } from '~/context/SnackbarContext'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { translations } from '~/translations/translations'
import { FormFormData } from '~/views/Management/Forms/types/AddOrEditFormData'
import { Department } from '~/views/Management/Forms/types/Department'
import { Form } from '~/views/Management/Forms/types/Form'

export const useFormManagementLogic = () => {
    const intl = useIntl()

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
                    text: intl.formatMessage(translations.entityDeleted, {
                        article: intl.formatMessage(translations.neutralArticle),
                        entity: intl.formatMessage(translations.formLabel),
                    }),
                })
            },
            [refetchForms, showSnackbar, intl],
        ),
    })

    const { mutate: saveForm } = useMutation({
        mutationFn: useCallback(
            async (form: FormFormData) => {
                await supabase.from(Table.Forms).upsert(form).throwOnError()

                refetchForms()
                showSnackbar({
                    text: form.id
                        ? intl.formatMessage(translations.changesSaved)
                        : intl.formatMessage(translations.entityCreated, {
                              article: intl.formatMessage(translations.neutralArticle),
                              entity: intl.formatMessage(translations.formLabel),
                          }),
                })
            },
            [refetchForms, showSnackbar, intl],
        ),
    })

    const onSave = useCallback(
        (form: FormFormData) =>
            saveForm(form, {
                onError: (error) => {
                    Alert.alert(
                        intl.formatMessage(translations.error),
                        intl.formatMessage(translations.errorDescription),
                    )
                    console.error(`Unexpected error while saving a form: ${error.message}`)
                },
            }),
        [saveForm, intl],
    )
    const onClose = useCallback(() => setEditInfo(undefined), [setEditInfo])

    const onDelete = useCallback(
        (form: Form) => {
            showDialog({
                title: intl.formatMessage(translations.deleteEntityHeader, {
                    entity: intl.formatMessage(translations.formLabel),
                }),
                description: intl.formatMessage(translations.deleteEntityDescription, {
                    name: form.name,
                }),
                onAccept: () =>
                    deleteForm(form.id, {
                        onError: (error) => {
                            Alert.alert(
                                intl.formatMessage(translations.error),
                                intl.formatMessage(translations.errorDescription),
                            )
                            console.error(
                                `Unexpected error while deleting a form: ${error.message}`,
                            )
                        },
                    }),
            })
        },
        [showDialog, deleteForm, intl],
    )
    const onEdit = useCallback((form: Form) => setEditInfo({ initialData: form }), [])
    const onCreate = useCallback(() => setEditInfo({}), [])

    useEffect(() => {
        if (!formsError && !departmentsError) return

        Alert.alert(
            intl.formatMessage(translations.error),
            intl.formatMessage(translations.errorDescription),
        )
        console.error(formsError?.message ?? departmentsError?.message)
    }, [formsError, departmentsError, intl])

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
