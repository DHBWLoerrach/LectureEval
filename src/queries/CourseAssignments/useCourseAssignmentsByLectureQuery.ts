import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { CourseAssignment } from '~/types/CourseAssignment'

type Props = {
    lectureID: number | undefined
}

export const useCourseAssignmentsByLectureQuery = ({ lectureID }: Props) => {
    const queryFn = useCallback(async () => {
        const { data } = await supabase
            .from(Table.CourseAssignments)
            .select('*')
            .eq('lectureID', lectureID)
            .throwOnError()

        return data ?? []
    }, [lectureID])

    return useQuery<CourseAssignment[]>({
        queryKey: ['courseAssignmentsByLectureQuery', lectureID],
        queryFn,
        enabled: !!lectureID,
    })
}
