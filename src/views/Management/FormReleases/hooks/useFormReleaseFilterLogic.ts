import { useDeferredValue, useMemo, useState } from 'react';
import { CourseAssignmentWithLecture } from '~/queries/CourseAssignments/useCourseAssignmentsWithLectureQuery';

type Props = {
  assignments: CourseAssignmentWithLecture[];
};

export const useFormReleaseFilterLogic = ({ assignments }: Props) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDeferredValue(search);

  const filteredAssignments = useMemo(() => {
    return assignments?.filter((assignment) => {
      return assignment.lecture.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
    });
  }, [assignments, debouncedSearch]);

  return {
    search,
    setSearch,
    filteredAssignments,
  };
};
