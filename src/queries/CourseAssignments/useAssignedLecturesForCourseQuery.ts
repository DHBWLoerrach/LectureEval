import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';
import { Form } from '~/types/Form';
import { Lecture } from '~/types/Lecture';
import { Lecturer } from '~/types/Lecturer';

type Props = {
  courseID: number | undefined;
};

export type LectureAssignment = {
  id: number;
  releaseDate: string;
  recallDate: string;
  lecture: Lecture;
  lecturer: Lecturer;
  form: Form;
};

export const useAssignedLecturesForCourseQuery = ({ courseID }: Props) => {
  const queryFn = useCallback(async () => {
    const response = await supabase
      .from(Table.CourseAssignments)
      // Join data from other tables
      .select(
        'id, releaseDate, recallDate, lectures(*), lecturers(*), forms(*)'
      )
      .eq('courseID', courseID);

    return (
      /**
       * supabase joins are not typed correctly and are returned as an array of elements
       * however we know that it will always be exactly one element
       * so we map over the array and cast the joined values to the correct types
       */
      response.data?.map((assignment) => ({
        id: assignment.id as number,
        releaseDate: assignment.releaseDate as string,
        recallDate: assignment.recallDate as string,
        lecture: assignment.lectures as unknown as Lecture,
        lecturer: assignment.lecturers as unknown as Lecturer,
        form: assignment.forms as unknown as Form,
      })) ?? []
    );
  }, [courseID]);

  return useQuery<LectureAssignment[]>({
    queryKey: ['assignedLecturesForCourseQuery', courseID],
    queryFn,
    enabled: !!courseID,
  });
};
