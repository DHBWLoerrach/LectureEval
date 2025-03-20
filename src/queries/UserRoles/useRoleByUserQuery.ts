import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Role } from '~/enums/Role';
import { Table } from '~/enums/Table';
import { supabase } from '~/services/supabase';

type Props = {
  userID: string | undefined;
};

export const useRoleByUserQuery = ({ userID }: Props) => {
  const queryFn = useCallback(async () => {
    const response = await supabase
      .from(Table.UserRoles)
      .select('role(name)')
      .eq('user', userID)
      .single()
      .throwOnError();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore because supabase typings are incorrect
    return response.data?.role.name as Role;
  }, [userID]);

  return useQuery<Role>({
    queryKey: ['roleByUserQuery', userID],
    queryFn,
    enabled: !!userID,
  });
};
