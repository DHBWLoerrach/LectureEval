import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { Lecture } from '~/types/Lecture';

type Props = {
  lectureId: number | undefined;
};

export const useLectureQuery = ({ lectureId }: Props) => {
  const queryFn = useCallback(async () => {
    const { data } = await supabase
      .from(Table.Lectures)
      .select('*')
      .eq('id', lectureId)
      .single()
      .throwOnError();

    return data;
  }, [lectureId]);

  return useQuery<Lecture>({
    queryKey: ['lectureQuery', lectureId],
    queryFn,
    enabled: !!lectureId,
  });
};
