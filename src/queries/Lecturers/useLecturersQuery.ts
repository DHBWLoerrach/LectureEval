import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Lecturer } from '~/types/Lecturer'

export const useLecturersQuery = () => {
    const queryFn = useCallback(async () => {
        const { data } = await supabase
            .from(Table.Lecturers)
            .select('*')
            .order('firstName', { ascending: true })
            .throwOnError()

        return data ?? []
    }, [])

    return useQuery<Lecturer[]>({
        queryKey: ['lecturersQuery'],
        queryFn,
    })
}
