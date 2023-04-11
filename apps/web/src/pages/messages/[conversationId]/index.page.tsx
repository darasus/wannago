import {ArrowLeftCircleIcon} from '@heroicons/react/24/solid';
import {
  useMarkConversationAsSeen,
  useMyOrganizationQuery,
  useMyUserQuery,
  useSessionQuery,
} from 'hooks';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';
import {trpc} from 'trpc/src/trpc';
import {Button, CardBase, Container, LoadingBlock, PageHeader, Text} from 'ui';
import {formatDate, getConversationMembers} from 'utils';
import {MessageInput} from './features/MessageInput/MessageInput';

export default function ConversationPage() {
  const me = useMyUserQuery();
  const organization = useMyOrganizationQuery();
  const session = useSessionQuery();
  const router = useRouter();
  const conversationId = router.query.conversationId as string;
  const {mutate} = useMarkConversationAsSeen();
  const conversation = trpc.conversation.getConversationById.useQuery(
    {
      conversationId,
    },
    {
      enabled: Boolean(conversationId),
      onSuccess: () => {
        mutate({conversationId});
      },
    }
  );

  const conversationMembers = getConversationMembers(
    conversation.data,
    session.data === 'user' ? me.data : organization.data
  );

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
        title={
          <>
            <Text>Conversation with </Text>
            {conversationMembers.map(({label, href}) => (
              <Link className="underline" href={href}>
                {label}
              </Link>
            ))}
          </>
        }
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
