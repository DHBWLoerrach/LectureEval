import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { UserLocation } from '~/types/UserLocation';

type Props = {
  userId: string | undefined;
};

export const useUserLocationsQuery = ({ userId }: Props) => {
  const queryFn = useCallback(async () => {
    const { data } = await supabase
      .from(Table.UserLocations)
      .select('*')
      .eq('userId', userId)
      .single()
      .throwOnError();

    return data;
  }, [userId]);

  return useQuery<UserLocation>({
    queryKey: ['userLocationsQuery', userId],
    queryFn,
    enabled: !!userId,
  });
};
