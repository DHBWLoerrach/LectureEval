import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'

export const useDeleteLectureMutation = () => {
    const mutationFn = useCallback(async (id: number) => {
        await supabase.from(Table.Lectures).delete().eq('id', id).throwOnError()
    }, [])

    return useMutation({
        mutationFn,
    })
}
