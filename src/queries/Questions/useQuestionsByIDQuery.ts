import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { Question } from '~/types/Question';

type Props = {
  questionIDs: number[] | undefined;
};

export const useQuestionsByIDQuery = ({ questionIDs }: Props) => {
  const queryFn = useCallback(async () => {
    if (!questionIDs || questionIDs.length === 0) {
      return [];
    }

    const { data } = await supabase
      .from(Table.Questions)
      .select('*')
      .in('id', questionIDs)
      .throwOnError();

    return data ?? [];
  }, [questionIDs]);

  return useQuery<Question[]>({
    queryKey: ['questionsByIDQuery', questionIDs],
    queryFn,
    enabled: !!questionIDs && questionIDs.length > 0,
  });
};
