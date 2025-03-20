import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';

export const useDeleteStepMutation = () => {
  const mutationFn = useCallback(async (stepId: number) => {
    await supabase
      .from(Table.Questions)
      .delete()
      .eq('stepID', stepId)
      .throwOnError();
    await supabase.from(Table.Steps).delete().eq('id', stepId).throwOnError();
  }, []);

  return useMutation({
    mutationFn,
  });
};
