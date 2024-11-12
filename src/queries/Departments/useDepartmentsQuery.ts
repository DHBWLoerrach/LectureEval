import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Department } from '~/types/Department'

export const useDepartmentsQuery = () => {
    const queryFn = useCallback(async () => {
        const { data } = await supabase.from(Table.Departments).select('*').throwOnError()

        return data ?? []
    }, [])

    return useQuery<Department[]>({
        queryKey: ['departmentsQuery'],
        queryFn,
    })
}
