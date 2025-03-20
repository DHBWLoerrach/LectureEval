import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';

export const useDeleteQuestionMutation = () => {
  const mutationFn = useCallback(async (questionId: number) => {
    await supabase
      .from(Table.Questions)
      .delete()
      .eq('id', questionId)
      .throwOnError();
  }, []);

  return useMutation({
    mutationFn,
  });
};
