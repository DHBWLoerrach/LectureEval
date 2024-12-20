import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { CourseAssignment } from '~/types/CourseAssignment'
import { Lecture } from '~/types/Lecture'

export type CourseAssignmentWithLecture = CourseAssignment & {
    lecture: Lecture
}

export const useCourseAssignmentsWithLectureQuery = () => {
    const queryFn = useCallback(async () => {
        const response = await supabase
            .from(Table.CourseAssignments)
            // Join data from other tables
            .select('*, lectures(*)')
            .throwOnError()

        return (
            /**
             * supabase joins are not typed correctly and are returned as an array of elements
             * however we know that it will always be exactly one element
             * so we map over the array and cast the joined values to the correct types
             */
            response.data?.map(
                (assignment): CourseAssignmentWithLecture => ({
                    id: assignment.id,
                    courseID: assignment.courseID,
                    formID: assignment.formID,
                    lectureID: assignment.lectureID,
                    lecturerID: assignment.lecturerID,
                    recallDate: assignment.recallDate,
                    releaseDate: assignment.releaseDate,
                    lecture: assignment.lectures as unknown as Lecture,
                }),
            ) ?? []
        )
    }, [])

    return useQuery<CourseAssignmentWithLecture[]>({
        queryKey: ['courseAssignmentsWithLectureQuery'],
        queryFn,
    })
}
