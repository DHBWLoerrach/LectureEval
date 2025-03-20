import { useDeferredValue, useMemo, useState } from 'react';
import { Question } from '~/types/Question';

type Props = {
  questions?: Question[];
};

export const useDetailsFilterLogic = ({ questions }: Props) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDeferredValue(search);

  const searchedDetails = useMemo(() => {
    return questions?.filter((questions) => {
      const matchesName = questions.question
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

      return matchesName;
    });
  }, [questions, debouncedSearch]);

  return {
    search,
    setSearch,
    searchedDetails,
  };
};
