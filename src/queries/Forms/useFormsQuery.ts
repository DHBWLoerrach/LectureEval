import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Form } from '~/types/Form'

export const useFormsQuery = () => {
    const queryFn = useCallback(async () => {
        const { data } = await supabase.from(Table.Forms).select('*').throwOnError()

        return data ?? []
    }, [])

    return useQuery<Form[]>({
        queryKey: ['formsQuery'],
        queryFn,
    })
}
