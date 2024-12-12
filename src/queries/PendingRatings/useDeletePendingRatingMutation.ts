import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'

type Props = {
    studentId: number
    courseAssignmentId: number
}

export const useDeletePendingRatingMutation = () => {
    const mutationFn = useCallback(async ({ courseAssignmentId, studentId }: Props) => {
        await supabase
            .from(Table.PendingRatings)
            .delete()
            .eq('courseAssignmentID', courseAssignmentId)
            .eq('studentID', studentId)
            .throwOnError()
    }, [])

    return useMutation({
        mutationFn,
    })
}
