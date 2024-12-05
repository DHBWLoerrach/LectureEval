import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Lecturer } from '~/types/Lecturer'

type Props = {
    userId: string | undefined
}

export const useLecturerByUIDQuery = ({ userId }: Props) => {
    const queryFn = useCallback(async () => {
        const { data } = await supabase
            .from(Table.Lecturers)
            .select('*')
            .eq('userID', userId)
            .single()
            .throwOnError()

        return data
    }, [userId])

    return useQuery<Lecturer>({
        queryKey: ['lecturerByUIDQuery', userId],
        queryFn,
        enabled: !!userId,
    })
}
