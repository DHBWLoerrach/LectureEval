import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';

type Props = {
  courseId: number | undefined;
  formId: number | undefined;
};

export const useCourseAssignmentByCourseAndFormQuery = ({
  courseId,
  formId,
}: Props) => {
  const queryFn = useCallback(async () => {
    const response = await supabase
      .from(Table.CourseAssignments)
      .select()
      .eq('courseID', courseId)
      .eq('formID', formId)
      .single()
      .throwOnError();

    return response.data;
  }, [courseId, formId]);

  return useQuery({
    queryKey: ['courseAssignmentByCourseAndFormQuery', courseId, formId],
    queryFn,
    enabled: !!courseId && !!formId,
  });
};
