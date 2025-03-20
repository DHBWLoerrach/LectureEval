import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { CourseAssignment } from '~/types/CourseAssignment';

type Props = {
  courseAssignmentID: number | undefined;
};

export const useCourseAssignmentQuery = ({ courseAssignmentID }: Props) => {
  const queryFn = useCallback(async () => {
    const { data } = await supabase
      .from(Table.CourseAssignments)
      .select('*')
      .eq('id', courseAssignmentID)
      .single()
      .throwOnError();

    return data;
  }, [courseAssignmentID]);

  return useQuery<CourseAssignment>({
    queryKey: ['courseAssignmentQuery', courseAssignmentID],
    queryFn,
    enabled: !!courseAssignmentID,
  });
};
