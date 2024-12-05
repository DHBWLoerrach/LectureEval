import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Lecturer } from '~/types/Lecturer'

type Props = {
    lecturerId: number | undefined
}

export const useLecturerQuery = ({ lecturerId }: Props) => {
    const queryFn = useCallback(async () => {
        const { data } = await supabase
            .from(Table.Lecturers)
            .select('*')
            .eq('id', lecturerId)
            .single()
            .throwOnError()

        return data
    }, [lecturerId])

    return useQuery<Lecturer>({
        queryKey: ['lecturerQuery', lecturerId],
        queryFn,
        enabled: !!lecturerId,
    })
}
