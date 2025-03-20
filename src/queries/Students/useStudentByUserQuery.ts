import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { Student } from '~/types/Student';

type Props = {
  userID: string | undefined;
  enabled?: boolean;
};

export const useStudentByUserQuery = ({ userID, enabled }: Props) => {
  const queryFn = useCallback(async () => {
    const { data } = await supabase
      .from(Table.Students)
      .select('*')
      .eq('userID', userID)
      .single()
      .throwOnError();

    return data;
  }, [userID]);

  return useQuery<Student>({
    queryKey: ['studentByUserQuery', userID],
    queryFn,
    enabled: enabled && !!userID,
  });
};
