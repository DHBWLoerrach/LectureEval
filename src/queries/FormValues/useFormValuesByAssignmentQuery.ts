import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { FormValue } from '~/types/FormValue'

type Props = {
    courseAssignmentID: number | undefined
}

export const useFormValuesByAssignmentQuery = ({ courseAssignmentID }: Props) => {
    const queryFn = useCallback(async () => {
        const { data } = await supabase
            .from(Table.FormValues)
            .select('*')
            .eq('courseAssignmentID', courseAssignmentID)
            .throwOnError()
        return data ?? []
    }, [courseAssignmentID])

    return useQuery<FormValue[]>({
        queryKey: ['formValuesByAssignmentQuery', courseAssignmentID],
        queryFn,
        enabled: !!courseAssignmentID,
    })
}
