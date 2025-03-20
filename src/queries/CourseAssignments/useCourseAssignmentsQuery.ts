import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { CourseAssignment } from '~/types/CourseAssignment';

export const useCourseAssignmentsQuery = () => {
  const queryFn = useCallback(async () => {
    const { data } = await supabase
      .from(Table.CourseAssignments)
      .select('*')
      .throwOnError();

    return data ?? [];
  }, []);

  return useQuery<CourseAssignment[]>({
    queryKey: ['courseAssignmentsQuery'],
    queryFn,
  });
};
