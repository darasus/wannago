'use client';

import {useCallback, useTransition} from 'react';
import {toast} from 'react-hot-toast';
import {api} from '../../../../apps/web/src/trpc/client';
import {Conversation, User} from '@prisma/client';
import {useAuth} from '@clerk/nextjs';

interface Props {
  me: User | null;
}

export function useCreateConversation({me}: Props) {
  const auth = useAuth();
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
        const organizationIds = [] as string[];
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
        if (organizationId) {
          organizationIds.push(organizationId);
        }

        startTransition(async () => {
          const conversation = await api.conversation.createConversation.mutate(
            {
              organizationIds,
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
