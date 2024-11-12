import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { QuestionType } from '~/types/QuestionType'

export const useQuestionTypesQuery = () => {
    const queryFn = useCallback(async () => {
        const { data } = await supabase.from(Table.QuestionTypes).select('*').throwOnError()

        return data ?? []
    }, [])

    return useQuery<QuestionType[]>({
        queryKey: ['questionTypesQuery'],
        queryFn,
    })
}
