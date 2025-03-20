import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';

export const useDeleteDepartmentMutation = () => {
  const mutationFn = useCallback(async (departmentId: number | undefined) => {
    await supabase
      .from(Table.Departments)
      .delete()
      .eq('id', departmentId)
      .throwOnError();
  }, []);

  return useMutation({
    mutationFn,
  });
};
