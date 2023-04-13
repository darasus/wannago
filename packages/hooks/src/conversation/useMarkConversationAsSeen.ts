import {trpc} from 'trpc/src/trpc';
import {useHasUnseenConversation} from './useHasUnseenConversation';

export function useMarkConversationAsSeen() {
  const {refetch} = useHasUnseenConversation();
  return trpc.conversation.markConversationAsSeen.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });
}
