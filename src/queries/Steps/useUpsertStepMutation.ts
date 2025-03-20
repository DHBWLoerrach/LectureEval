import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { StepFormData } from '~/views/Management/Designer/types/StepFormData';

export const useUpsertStepMutation = () => {
  const mutationFn = useCallback(async (data: StepFormData) => {
    await supabase.from(Table.Steps).upsert(data).throwOnError();
  }, []);

  return useMutation({
    mutationFn,
  });
};
