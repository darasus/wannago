import {useCallback} from 'react';
import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {useMyOrganizationQuery} from '../organization/useMyOrganizationQuery';
import {useMyUserQuery} from '../user/useMyUserQuery';

export function useCreateConversation() {
  const me = useMyUserQuery();
  const myOrganization = useMyOrganizationQuery();
  const createConversationMutation =
    trpc.conversation.createConversation.useMutation();

  const isMutating = createConversationMutation.isLoading;
  const isLoading = me.isInitialLoading || myOrganization.isInitialLoading;

  const createConversation = useCallback(
    ({
      organizationId,
      userId,
    }: {
      userId: string | null | undefined;
      organizationId: string | null | undefined;
    }) => {
      const organizationIds = [] as string[];
      const userIds = [me.data?.id] as string[];

      if (!me.data?.id && !myOrganization.data?.id) {
        toast.error('To be able to message anyone you need to login first');
        return;
      }

      if (me.data?.id === userId) {
        toast.error('You cannot message yourself');
        return;
      }
      if (
        myOrganization.data?.id &&
        myOrganization.data?.id === organizationId
      ) {
        toast.error('You cannot message your own organization');
        return;
      }

      if (userId) {
        userIds.push(userId);
      }
      if (organizationId) {
        organizationIds.push(organizationId);
      }

      return createConversationMutation.mutateAsync({
        organizationIds,
        userIds,
      });
    },
    [createConversationMutation, me.data?.id, myOrganization.data?.id]
  );

  return {createConversation, isLoading, isMutating};
}
