import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Department } from '~/types/Department'

type Props = {
    departmentId: number | undefined
}

export const useDepartmentQuery = ({ departmentId }: Props) => {
    const queryFn = useCallback(async () => {
        const { data } = await supabase
            .from(Table.Departments)
            .select('*')
            .eq('id', departmentId)
            .single()
            .throwOnError()

        return data
    }, [departmentId])

    return useQuery<Department>({
        queryKey: ['departmentQuery'],
        queryFn,
        enabled: !!departmentId,
    })
}
