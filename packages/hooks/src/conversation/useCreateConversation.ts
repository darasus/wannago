'use client';

import {use, useCallback, useTransition} from 'react';
import {toast} from 'sonner';
import {api} from '../../../../apps/web/src/trpc/client';
import {Conversation} from '@prisma/client';
import {useAuth} from '@clerk/nextjs';

export function useCreateConversation() {
  const auth = useAuth();
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

        if (!auth.userId) {
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
    [me?.id, auth.userId]
  );

  return {
    createConversation,
    isMutating: isPending,
  };
}
