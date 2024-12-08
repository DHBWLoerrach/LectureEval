import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Lecturer } from '~/types/Lecturer'

type Props = {
    userId: string | undefined
    enabled?: boolean
}

export const useLecturerByUserQuery = ({ userId, enabled }: Props) => {
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
        queryKey: ['lecturerByUserQuery', userId],
        queryFn,
        enabled: enabled && !!userId,
    })
}
