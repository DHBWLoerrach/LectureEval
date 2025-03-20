import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { QuestionFormData } from '~/views/Management/Designer/types/QuestionFormData';

export const useUpsertQuestionMutation = () => {
  const mutationFn = useCallback(async (question: QuestionFormData) => {
    await supabase.from(Table.Questions).upsert(question).throwOnError();
  }, []);

  return useMutation({
    mutationFn,
  });
};
