import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Course } from '~/types/Course'

type Props = {
    courseIDs: number[] | undefined
}

export const useCoursesByIDQuery = ({ courseIDs }: Props) => {
    const queryFn = useCallback(async () => {
        if (!courseIDs || courseIDs.length === 0) {
            return []
        }

        const { data } = await supabase
            .from(Table.Courses)
            .select('*')
            .in('id', courseIDs)
            .throwOnError()

        return data ?? []
    }, [courseIDs])

    return useQuery<Course[]>({
        queryKey: ['coursesByIDQuery', courseIDs],
        queryFn,
        enabled: !!courseIDs,
    })
}
