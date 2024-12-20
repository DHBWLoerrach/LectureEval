import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Semester } from '~/types/Semester'

export const useSemestersQuery = () => {
    const queryFn = useCallback(async () => {
        const { data } = await supabase
            .from(Table.Semesters)
            .select('*')
            .order('name', { ascending: true })
            .throwOnError()

        return data ?? []
    }, [])

    return useQuery<Semester[]>({
        queryKey: ['semestersQuery'],
        queryFn,
    })
}
