import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Course } from '~/types/Course'

export const useCoursesQuery = () => {
    const queryFn = useCallback(async () => {
        const { data } = await supabase
            .from(Table.Courses)
            .select('*')
            .order('name', { ascending: true })
            .throwOnError()

        return data ?? []
    }, [])

    return useQuery<Course[]>({
        queryKey: ['coursesQuery'],
        queryFn,
    })
}
