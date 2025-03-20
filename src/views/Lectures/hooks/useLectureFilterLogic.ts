import { useDeferredValue, useMemo, useState } from 'react';
import { Department } from '~/types/Department';
import { Lecture } from '~/types/Lecture';

type Props = {
  lectures: Lecture[];
  departments: Department[];
};

export const useLectureFilterLogic = ({ lectures, departments }: Props) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDeferredValue(search);

  const searchedLectures = useMemo(() => {
    return lectures.filter((lecture) => {
      const matchesName = lecture.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

      // Lecture names need to be unique per department
      const department = departments.find((dept) =>
        dept.name.toLowerCase().startsWith(debouncedSearch.toLowerCase())
      );
      const matchesDepartment = department
        ? department.id === lecture.departmentID
        : false;

      return matchesName || matchesDepartment;
    });
  }, [lectures, departments, debouncedSearch]);

  return {
    search,
    setSearch,
    searchedLectures,
  };
};
