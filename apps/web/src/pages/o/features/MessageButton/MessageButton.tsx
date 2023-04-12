import {ChatBubbleBottomCenterTextIcon} from '@heroicons/react/24/outline';
import {
  useCreateConversation,
  useMyOrganizationQuery,
  useMyUserQuery,
} from 'hooks';
import {useRouter} from 'next/router';
import {Button} from 'ui';

export function MessageButton() {
  const me = useMyUserQuery();
  const myOrganization = useMyOrganizationQuery();
  const router = useRouter();
  const organizationId = router.query.organizationId as string;
  const userId = router.query.userId as string;
  const {createConversation, isLoading} = useCreateConversation();

  const handleOnClick = async () => {
    const conversation = await createConversation({organizationId, userId});

    if (conversation) {
      router.push(`/messages/${conversation.id}`);
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
      data-testid="message-button"
    >
      Message
    </Button>
  );
}
