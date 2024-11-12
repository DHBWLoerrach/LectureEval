import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { FormFormData } from '~/views/Management/Forms/types/FormFormData'

export const useUpsertFormMutation = () => {
    const mutationFn = useCallback(async (form: FormFormData) => {
        await supabase.from(Table.Forms).upsert(form).throwOnError()
    }, [])

    return useMutation({
        mutationFn,
    })
}
