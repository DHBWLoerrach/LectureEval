import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { CourseFormData } from '~/views/Management/Courses/types/CourseFormData';

export const useUpsertCourseMutation = () => {
  const mutationFn = useCallback(async (course: CourseFormData) => {
    await supabase.from(Table.Courses).upsert(course).throwOnError();
  }, []);

  return useMutation({
    mutationFn,
  });
};
