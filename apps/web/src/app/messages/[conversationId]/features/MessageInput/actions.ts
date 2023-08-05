'use server';

import {api} from '../../../../../trpc/server-http';

export async function revalidateGetConversationById({
  conversationId,
}: {
  conversationId: string;
}) {
  await api.conversation.getConversationById.revalidate({
    conversationId,
  });
}
