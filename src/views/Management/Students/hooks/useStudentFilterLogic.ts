import { useDeferredValue, useMemo, useState } from 'react';
import { Student } from '~/types/Student';

type Props = {
  students: Student[];
};

export const useStudentFilterLogic = ({ students }: Props) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDeferredValue(search);

  const filteredStudents = useMemo(() => {
    return students?.filter((student) => {
      return (
        student.lastName
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        student.firstName
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      );
    });
  }, [students, debouncedSearch]);

  return {
    search,
    setSearch,
    filteredStudents,
  };
};
