import {useCallback} from 'react';
import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {useMyOrganizationQuery} from './organization/useMyOrganizationQuery';
import {useSessionQuery} from './session/useSessionQuery';
import {useMyUserQuery} from './user/useMyUserQuery';

export function useCreateConversation() {
  const me = useMyUserQuery();
  const myOrganization = useMyOrganizationQuery();
  const session = useSessionQuery();
  const {mutateAsync, isLoading} =
    trpc.conversation.createConversation.useMutation();
  const organizationIds = [
    session.data === 'organization' && myOrganization.data?.id,
  ].filter(Boolean) as string[];
  const userIds = [session.data === 'user' && me.data?.id].filter(
    Boolean
  ) as string[];

  const createConversation = useCallback(
    ({
      organizationId,
      userId,
    }: {
      userId: string | null | undefined;
      organizationId: string | null | undefined;
    }) => {
      if (me.data?.id === userId) {
        toast.error('You cannot message yourself');
        return;
      }
      if (myOrganization.data?.id === organizationId) {
        toast.error('You cannot message your own organization');
        return;
      }

      if (userId) {
        userIds.push(userId);
      }
      if (organizationId) {
        organizationIds.push(organizationId);
      }

      return mutateAsync({
        organizationIds,
        userIds,
      });
    },
    [
      mutateAsync,
      organizationIds,
      userIds,
      me.data?.id,
      myOrganization.data?.id,
    ]
  );

  return {createConversation, isLoading};
}
