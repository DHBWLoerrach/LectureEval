import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Lecture } from '~/types/Lecture'
import { Lecturer } from '~/types/Lecturer'

type Props = {
    courseID: number | undefined
}

export type LectureAssignment = {
    id: number
    lecture: Lecture
    lecturer: Lecturer
}

export const useAssignedLecturesForCourseQuery = ({ courseID }: Props) => {
    const queryFn = useCallback(async () => {
        const response = await supabase
            .from(Table.CourseAssignments)
            .select('id, lectures(*), lecturers(*)')
            .eq('courseID', courseID)

        return (
            response.data?.map((assignment) => ({
                id: assignment.id as number,
                lecture: assignment.lectures as unknown as Lecture,
                lecturer: assignment.lecturers as unknown as Lecturer,
            })) ?? []
        )
    }, [courseID])

    return useQuery<LectureAssignment[]>({
        queryKey: ['assignedLecturesForCourseQuery', courseID],
        queryFn,
        enabled: !!courseID,
    })
}
