import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { Lecture } from '~/types/Lecture';

type Props = {
  lectureIDs: number[] | undefined;
};

export const useLecturesByIDQuery = ({ lectureIDs }: Props) => {
  const queryFn = useCallback(async () => {
    if (!lectureIDs || lectureIDs.length === 0) {
      return [];
    }

    const { data } = await supabase
      .from(Table.Lectures)
      .select('*')
      .in('id', lectureIDs)
      .throwOnError();

    return data ?? [];
  }, [lectureIDs]);

  return useQuery<Lecture[]>({
    queryKey: ['lecturesByIDQuery', lectureIDs],
    queryFn,
    enabled: !!lectureIDs && lectureIDs.length > 0,
  });
};
