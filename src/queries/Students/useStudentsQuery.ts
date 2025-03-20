import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { Student } from '~/types/Student';

export const useStudentsQuery = () => {
  const queryFn = useCallback(async () => {
    const { data } = await supabase
      .from(Table.Students)
      .select('*')
      .order('firstName', { ascending: true })
      .throwOnError();

    return data ?? [];
  }, []);

  return useQuery<Student[]>({
    queryKey: ['studentsQuery'],
    queryFn,
  });
};
