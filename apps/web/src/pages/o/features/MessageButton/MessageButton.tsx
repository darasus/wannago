import {ChatBubbleBottomCenterTextIcon} from '@heroicons/react/24/outline';
import {useMyOrganizationQuery, useMyUserQuery} from 'hooks';
import {useRouter} from 'next/router';
import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {Button} from 'ui';

export function MessageButton() {
  const me = useMyUserQuery();
  const myOrganization = useMyOrganizationQuery();
  const router = useRouter();
  const organizationId = router.query.organizationId as string;
  const userId = router.query.userId as string;
  const {mutateAsync, isLoading} =
    trpc.conversation.createConversation.useMutation();

  const handleOnClick = async () => {
    if (me.data?.id === userId) {
      toast.error('You cannot message yourself');
      return;
    }
    if (myOrganization.data?.id === organizationId) {
      toast.error('You cannot message your own organization');
      return;
    }

    if (me.data?.id) {
      const result = await mutateAsync({
        organizationIds: [organizationId].filter(Boolean),
        userIds: [me.data?.id, userId].filter(Boolean),
      });

      const conversationId = result.id;

      if (conversationId) {
        router.push(`/messages/${conversationId}`);
      }
    }
  };

  return (
    <Button
      size="sm"
      iconLeft={<ChatBubbleBottomCenterTextIcon />}
      variant="neutral"
      onClick={handleOnClick}
      isLoading={isLoading}
      className="w-40"
    >
      Message
    </Button>
  );
}
