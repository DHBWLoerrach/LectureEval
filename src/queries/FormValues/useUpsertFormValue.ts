import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { FormValue } from '~/types/FormValue'

export const useInsertFormValueMutation = () => {
    const mutationFn = useCallback(async (formValue: FormValue | FormValue[]) => {
        await supabase.from(Table.FormValues).insert(formValue).throwOnError()
    }, [])

    return useMutation({
        mutationFn,
    })
}
