import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { DepartmentFormData } from '~/views/Management/Departments/types/DepartmentFormData'

export const useUpsertDepartmentMutation = () => {
    const mutationFn = useCallback(async (department: DepartmentFormData) => {
        await supabase.from(Table.Departments).upsert(department).throwOnError()
    }, [])

    return useMutation({
        mutationFn,
    })
}
