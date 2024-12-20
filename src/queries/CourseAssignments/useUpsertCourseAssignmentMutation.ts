import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { CourseAssignmentFormData } from '~/views/Management/FormReleases/types/CourseAssignmentFormData'

export const useUpsertCourseAssignmentMutation = () => {
    const mutationFn = useCallback(async (assignment: CourseAssignmentFormData) => {
        await supabase.from(Table.CourseAssignments).upsert(assignment).throwOnError()
    }, [])

    return useMutation({
        mutationFn,
    })
}
