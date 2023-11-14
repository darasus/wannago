'use client';

import {use, useCallback, useTransition} from 'react';
import {toast} from 'sonner';
import {api} from '../../../../apps/web/src/trpc/client';
import {Conversation} from '@prisma/client';

export function useCreateConversation() {
  const me = use(api.user.me.query());
  const [isPending, startTransition] = useTransition();

  const createConversation = useCallback(
    ({
      organizationId,
      userId,
    }: {
      userId: string | null | undefined;
      organizationId: string | null | undefined;
    }): Promise<Conversation> => {
      return new Promise((resolve) => {
        const userIds = [me?.id] as string[];

        if (!me?.id) {
          toast.error('Please login first');
          return;
        }

        if (me?.id === userId) {
          toast.error(`You can't message yourself`);
          return;
        }

        if (userId) {
          userIds.push(userId);
        }

        startTransition(async () => {
          const conversation = await api.conversation.createConversation.mutate(
            {
              organizationId: organizationId || undefined,
              userIds,
            }
          );
          resolve(conversation);
        });
      });
    },
    [me?.id]
  );

  return {
    createConversation,
    isMutating: isPending,
  };
}
