import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { Location } from '~/types/Location'

type Props = {
    locationId: number | undefined
}

export const useLocationQuery = ({ locationId }: Props) => {
    const queryFn = useCallback(async () => {
        const response = await supabase
            .from(Table.Locations)
            .select('*')
            .eq('id', locationId)
            .single()
            .throwOnError()

        return response.data
    }, [locationId])

    return useQuery<Location>({
        queryKey: ['locationQuery'],
        queryFn,
        enabled: !!locationId,
    })
}
