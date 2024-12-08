import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { supabase } from '~/services/supabase'

type Props = {
    courseID: number | undefined
}

export const useCourseAssignmentsByCourseQuery = ({ courseID }: Props) => {
    const queryFn = useCallback(async () => {
        const response = await supabase
            .from('course_assignments')
            .select('*')
            .eq('courseID', courseID)
            .throwOnError()

        return response.data ?? []
    }, [courseID])

    return useQuery({
        queryKey: ['courseAssignmentsByCourseQuery', courseID],
        queryFn,
        enabled: !!courseID,
    })
}
