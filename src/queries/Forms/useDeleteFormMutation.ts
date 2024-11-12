import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'

export const useDeleteFormMutation = () => {
    const mutationFn = useCallback(async (id: number) => {
        await supabase.from(Table.Forms).delete().eq('id', id).throwOnError()
    }, [])

    return useMutation({
        mutationFn,
    })
}
