'use client';

import {use, useCallback, useTransition} from 'react';
import {toast} from 'react-hot-toast';
import {api} from '../../../../apps/web/src/trpc/client';
import {Conversation} from '@prisma/client';

export function useCreateConversation() {
  const [isPending, startTransition] = useTransition();
  const me = use(api.user.me.query());
  const myOrganization = use(api.organization.getMyOrganization.query());

  const createConversation = useCallback(
    ({
      organizationId,
      userId,
    }: {
      userId: string | null | undefined;
      organizationId: string | null | undefined;
    }): Promise<Conversation> => {
      return new Promise(resolve => {
        const organizationIds = [] as string[];
        const userIds = [me?.id] as string[];

        if (!me?.id && !myOrganization?.id) {
          toast.error('To be able to message anyone you need to login first');
          return;
        }

        if (me?.id === userId) {
          toast.error('You cannot message yourself');
          return;
        }
        if (myOrganization?.id && myOrganization?.id === organizationId) {
          toast.error('You cannot message your own organization');
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
    [me?.id, myOrganization?.id]
  );

  return {
    createConversation,
    isLoading: !me || !myOrganization,
    isMutating: isPending,
  };
}
