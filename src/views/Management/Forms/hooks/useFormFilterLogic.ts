import { useDeferredValue, useMemo, useState } from 'react';
import { Form } from '~/types/Form';

type Props = {
  forms: Form[];
};

export const useFormFilterLogic = ({ forms }: Props) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDeferredValue(search);

  const filteredForms = useMemo(() => {
    return forms?.filter((form) => {
      return form.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    });
  }, [forms, debouncedSearch]);

  return {
    search,
    setSearch,
    filteredForms,
  };
};
