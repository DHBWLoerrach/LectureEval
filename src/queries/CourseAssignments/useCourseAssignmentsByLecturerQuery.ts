import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { CourseAssignment } from '~/types/CourseAssignment'

type Props = {
    lecturerID: number | undefined
}

export const useCourseAssignmentsByLecturerQuery = ({ lecturerID }: Props) => {
    const queryFn = useCallback(async () => {
        const { data } = await supabase
            .from(Table.CourseAssignments)
            .select('*')
            .eq('lecturerID', lecturerID)
            .throwOnError()

        return data ?? []
    }, [lecturerID])

    return useQuery<CourseAssignment[]>({
        queryKey: ['courseAssignmentsByLecturerQuery', lecturerID],
        queryFn,
    })
}
