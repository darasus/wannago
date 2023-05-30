import {useAuth} from '@clerk/nextjs';
import {trpc} from 'trpc/src/trpc';

export function useHasUnseenConversation() {
  const {isSignedIn} = useAuth();
  return trpc.conversation.getUserHasUnseenConversation.useQuery(undefined, {
    enabled: isSignedIn,
  });
}
