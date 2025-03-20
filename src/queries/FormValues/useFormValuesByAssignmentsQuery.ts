import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { FormValue } from '~/types/FormValue';

type Props = {
  courseAssignmentIDs: number[] | undefined;
};

export const useFormValuesByAssignmentsQuery = ({
  courseAssignmentIDs,
}: Props) => {
  const queryFn = useCallback(async () => {
    if (!courseAssignmentIDs || courseAssignmentIDs.length === 0) {
      return [];
    }

    const { data } = await supabase
      .from(Table.FormValues)
      .select('*')
      .in('courseAssignmentID', courseAssignmentIDs)
      .throwOnError();
    return data ?? [];
  }, [courseAssignmentIDs]);

  return useQuery<FormValue[]>({
    queryKey: ['formValuesByAssignmentsQuery', courseAssignmentIDs],
    queryFn,
    enabled: !!courseAssignmentIDs,
  });
};
