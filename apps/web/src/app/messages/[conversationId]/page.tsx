import Link from 'next/link';
import React, {Fragment} from 'react';
import {Avatar, Button, CardBase, Container, PageHeader, Text} from 'ui';
import {formatDate, getConversationMembers} from 'utils';
import {MessageInput} from './features/MessageInput/MessageInput';
import {api} from '../../../trpc/server-http';
import {ChevronLeft} from 'lucide-react';

export default async function ConversationPage({
  params: {conversationId},
}: {
  params: {conversationId: string};
}) {
  const me = await api.user.me.query();
  await api.conversation.markConversationAsSeen
    .mutate({conversationId})
    .then(async () => {
      await api.conversation.getUserHasUnseenConversation.revalidate();
    });
  const conversation = await api.conversation.getConversationById.query({
    conversationId,
  });

  const conversationMembers = getConversationMembers(conversation, me);

  return (
    <Container className="flex flex-col gap-4" maxSize="sm">
      <Button asChild>
        <Link href="/messages">
          <ChevronLeft /> Back to conversations
        </Link>
      </Button>
      <PageHeader
        title={
          <>
            <Text>Conversation with </Text>
            {conversationMembers.map(({label, href}, i) => (
              <Fragment key={href}>
                <Link className="underline" href={href}>
                  {label}
                </Link>
                {conversationMembers.length - 1 === i ? '' : ' & '}
              </Fragment>
            ))}
          </>
        }
      />
      <CardBase>
        {conversation?.messages.length === 0 && (
          <Text className="text-center">No messages yet...</Text>
        )}
        <div className="flex flex-col gap-2">
          {conversation?.messages.map((message) => {
            const userOrganization = message.user?.organizations.find((o) =>
              conversation.organizations.map((o) => o.id).includes(o.id)
            )?.name;

            return (
              <div
                key={message.id}
                className="flex items-center bg-muted rounded-md p-4"
              >
                <div className="grow">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Avatar
                        className="w-7 h-7"
                        src={message.user?.profileImageSrc}
                        width={100}
                        height={100}
                        alt={`${message.user?.firstName}'s profile picture`}
                      />
                      <Text>
                        <b>{`${message.user?.firstName}${
                          userOrganization ? ` (${userOrganization} admin)` : ''
                        }`}</b>
                      </Text>
                      <div className="grow" />
                      <Text className="text-xs text-gray-400">
                        {formatDate(message.createdAt, 'hh:mm, MMM d')}
                      </Text>
                    </div>
                    <div data-testid="message-text">{message.text}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardBase>
      <CardBase>{me && <MessageInput me={me} />}</CardBase>
    </Container>
  );
}
