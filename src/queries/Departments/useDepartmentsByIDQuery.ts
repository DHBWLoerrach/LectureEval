import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { Department } from '~/types/Department';

type Props = {
  departmentIDs: number[] | undefined;
};

export const useDepartmentsByIDQuery = ({ departmentIDs }: Props) => {
  const queryFn = useCallback(async () => {
    if (!departmentIDs || departmentIDs.length === 0) {
      return [];
    }

    const { data } = await supabase
      .from(Table.Departments)
      .select('*')
      .in('id', departmentIDs)
      .throwOnError();

    return data ?? [];
  }, [departmentIDs]);

  return useQuery<Department[]>({
    queryKey: ['departmentsByIDQuery', departmentIDs],
    queryFn,
    enabled: !!departmentIDs,
  });
};
