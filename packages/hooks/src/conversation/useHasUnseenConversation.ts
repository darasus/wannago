import {trpc} from 'trpc/src/trpc';

export function useHasUnseenConversation() {
  return trpc.conversation.getUserHasUnseenConversation.useQuery();
}
