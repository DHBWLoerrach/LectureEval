import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Step } from '~/types/Step'

type Props = {
    formId: number
}

export const useStepsForFormQuery = ({ formId }: Props) => {
    const queryFn = useCallback(async () => {
        const { data } = await supabase
            .from(Table.Steps)
            .select('*')
            .eq('formID', formId)
            .throwOnError()

        return data ?? []
    }, [formId])

    return useQuery<Step[]>({
        queryKey: ['stepsForFormQuery', formId],
        queryFn,
        enabled: !!formId,
    })
}
