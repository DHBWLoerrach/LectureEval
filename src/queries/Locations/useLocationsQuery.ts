import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Location } from '~/types/Location'

export const useLocationsQuery = () => {
    const queryFn = useCallback(async () => {
        const response = await supabase
            .from(Table.Locations)
            .select('*')
            .order('name', { ascending: true })
            .throwOnError()

        return response.data ?? []
    }, [])

    return useQuery<Location[]>({
        queryKey: ['locationsQuery'],
        queryFn,
    })
}
