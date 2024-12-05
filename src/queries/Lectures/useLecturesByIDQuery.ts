import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Lecture } from '~/types/Lecture'

type Props = {
    lectureIDs: number[] | undefined
}

export const useLecturesByIDQuery = ({ lectureIDs: lectureIds }: Props) => {
    const queryFn = useCallback(async () => {
        if (!lectureIds || lectureIds.length === 0) {
            return []
        }

        const { data } = await supabase
            .from(Table.Lectures)
            .select('*')
            .in('id', lectureIds)
            .throwOnError()

        return data ?? []
    }, [lectureIds])

    return useQuery<Lecture[]>({
        queryKey: ['lecturesByIDQuery', lectureIds],
        queryFn,
        enabled: !!lectureIds,
    })
}
