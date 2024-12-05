import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Semester } from '~/types/Semester'

type Props = {
    semesterIDs: number[] | undefined
}

export const useSemestersByIDQuery = ({ semesterIDs }: Props) => {
    const queryFn = useCallback(async () => {
        if (!semesterIDs || semesterIDs.length === 0) {
            return []
        }

        const { data } = await supabase
            .from(Table.Semesters)
            .select('*')
            .in('id', semesterIDs)
            .throwOnError()

        return data ?? []
    }, [semesterIDs])

    return useQuery<Semester[]>({
        queryKey: ['semestersByIDQuery', semesterIDs],
        queryFn,
        enabled: !!semesterIDs,
    })
}
