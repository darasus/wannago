import {ArrowLeftCircleIcon} from '@heroicons/react/24/solid';
import {useRouter} from 'next/router';
import {trpc} from 'trpc/src/trpc';
import {Button, CardBase, Container, LoadingBlock, PageHeader, Text} from 'ui';
import {formatDate} from 'utils';
import {MessageInput} from './features/MessageInput/MessageInput';

export default function ConversationPage() {
  const router = useRouter();
  const conversationId = router.query.conversationId as string;
  const conversation = trpc.conversation.getConversationById.useQuery(
    {
      conversationId,
    },
    {enabled: Boolean(conversationId)}
  );
  const organizations = conversation.data?.organizations || [];
  const users = conversation.data?.users || [];

  const items = [
    ...organizations.map(organization => {
      return {
        label: organization.name,
      };
    }),
    ...users.map(user => {
      return {
        label: user.firstName,
      };
    }),
  ];

  if (conversation.isLoading) {
    return <LoadingBlock />;
  }

  return (
    <Container className="flex flex-col gap-4" maxSize="sm">
      <Button
        as="a"
        href="/messages"
        variant="neutral"
        iconLeft={<ArrowLeftCircleIcon />}
      >
        Back to conversations
      </Button>
      <PageHeader
        title={items
          .map(({label}) => label)
          .sort()
          .join(' & ')}
      />
      <CardBase>
        {conversation.data?.messages.length === 0 && (
          <Text className="text-center">No messages yet...</Text>
        )}
        {conversation.data?.messages.map(message => {
          const name = message.organization?.name || message.user?.firstName;

          return (
            <div className="flex items-center" key={message.id}>
              <div className="grow">
                <Text>
                  <b>{name}:</b> {message.text}
                </Text>
              </div>
              <Text className="text-xs text-gray-400">
                {formatDate(message.createdAt, 'hh:mm, MMM d')}
              </Text>
            </div>
          );
        })}
      </CardBase>
      <CardBase>
        <MessageInput />
      </CardBase>
    </Container>
  );
}
