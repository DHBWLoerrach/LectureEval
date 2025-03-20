import { useDeferredValue, useMemo, useState } from 'react';
import { Department } from '~/types/Department';

type Props = {
  departments: Department[];
};

export const useDepartmentFilterLogic = ({ departments }: Props) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDeferredValue(search);

  const filteredDepartments = useMemo(() => {
    return departments?.filter((department) => {
      return department.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
    });
  }, [departments, debouncedSearch]);

  return {
    search,
    setSearch,
    filteredDepartments,
  };
};
