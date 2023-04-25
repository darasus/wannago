import {useRouter} from 'next/router';
import {trpc} from 'trpc/src/trpc';
import {useHasUnseenConversation} from '../conversation/useHasUnseenConversation';
import {useSessionQuery} from './useSessionQuery';

export function useSetSessionMutation() {
  const router = useRouter();
  const session = useSessionQuery();
  const hasUnseenConversation = useHasUnseenConversation();

  return trpc.session.setSession.useMutation({
    onSuccess: async () => {
      router.push('/dashboard');
      await Promise.all([session.refetch(), hasUnseenConversation.refetch()]);
    },
  });
}
