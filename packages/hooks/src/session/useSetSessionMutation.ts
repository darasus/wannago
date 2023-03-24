import {trpc} from 'trpc/src/trpc';
import {useSessionQuery} from './useSessionQuery';

export function useSetSessionMutation() {
  const session = useSessionQuery();

  return trpc.session.setSession.useMutation({
    onSuccess: () => {
      session.refetch();
    },
  });
}
