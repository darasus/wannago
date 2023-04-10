import {ChatBubbleBottomCenterTextIcon} from '@heroicons/react/24/outline';
import {useMyUserQuery} from 'hooks';
import {useRouter} from 'next/router';
import {trpc} from 'trpc/src/trpc';
import {Button} from 'ui';

export function MessageButton() {
  const me = useMyUserQuery();
  const router = useRouter();
  const organizationId = router.query.organizationId as string;
  const userId = router.query.userId as string;
  const {mutateAsync, isLoading} =
    trpc.conversation.createConversation.useMutation();

  const handleOnClick = async () => {
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
    >
      Message
    </Button>
  );
}
