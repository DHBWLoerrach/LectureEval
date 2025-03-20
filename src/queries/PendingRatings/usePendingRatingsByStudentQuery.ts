import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { PendingRating } from '~/types/PendingRating';

type Props = {
  studentID: number | undefined;
};

export const usePendingRatingsByStudentQuery = ({ studentID }: Props) => {
  const queryFn = useCallback(async () => {
    const response = await supabase
      .from(Table.PendingRatings)
      .select()
      .eq('studentID', studentID)
      .throwOnError();

    return response.data ?? [];
  }, [studentID]);

  return useQuery<PendingRating[]>({
    queryKey: ['pendingRatingsByStudentQuery', studentID],
    queryFn,
    enabled: !!studentID,
  });
};
