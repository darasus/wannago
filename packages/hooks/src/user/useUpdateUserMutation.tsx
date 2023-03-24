import {trpc} from 'trpc/src/trpc';
import {useMyUserQuery} from './useMyUserQuery';

export function useUpdateUserMutation() {
  const user = useMyUserQuery();

  return trpc.user.update.useMutation({
    onSettled: () => {
      user.refetch();
    },
  });
}
