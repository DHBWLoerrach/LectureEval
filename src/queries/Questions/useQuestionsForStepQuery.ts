import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { Question } from '~/types/Question';

type Props = {
  stepId: number | undefined;
};

export const useQuestionsForStepQuery = ({ stepId }: Props) => {
  const queryFn = useCallback(async () => {
    const { data } = await supabase
      .from(Table.Questions)
      .select('*')
      .eq('stepID', stepId)
      .order('serial', { ascending: true })
      .throwOnError();

    return data ?? [];
  }, [stepId]);

  return useQuery<Question[]>({
    queryKey: ['questionsForStepQuery', stepId],
    queryFn,
    enabled: !!stepId,
  });
};
