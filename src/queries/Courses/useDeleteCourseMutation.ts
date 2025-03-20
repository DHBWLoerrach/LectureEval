import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';

export const useDeleteCourseMutation = () => {
  const mutationFn = useCallback(async (id: number) => {
    await supabase.from(Table.Courses).delete().eq('id', id).throwOnError();
  }, []);

  return useMutation({
    mutationFn,
  });
};
