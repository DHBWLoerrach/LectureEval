import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Lecture } from '~/types/Lecture'

export const useLecturesQuery = () => {
    const queryFn = useCallback(async () => {
        const { data } = await supabase.from(Table.Lectures).select('*').throwOnError()

        return data ?? []
    }, [])

    return useQuery<Lecture[]>({
        queryKey: ['lecturesQuery'],
        queryFn,
    })
}
