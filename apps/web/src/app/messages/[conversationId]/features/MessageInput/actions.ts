'use server';

import {api} from '../../../../../trpc/server-http';

export async function sendMessage({
  conversationId,
  text,
  senderId,
}: {
  conversationId: string;
  text: string;
  senderId: string;
}) {
  await api.conversation.sendMessage.mutate({
    conversationId,
    text,
    senderId,
  });

  await api.conversation.getConversationById.revalidate();
}
