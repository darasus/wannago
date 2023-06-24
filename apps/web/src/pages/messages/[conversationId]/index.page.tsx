import {ArrowLeftCircleIcon} from '@heroicons/react/24/solid';
import {useMarkConversationAsSeen, useMyUserQuery} from 'hooks';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {Fragment} from 'react';
import {trpc} from 'trpc/src/trpc';
import {
  Avatar,
  Button,
  CardBase,
  Container,
  LoadingBlock,
  PageHeader,
  Text,
} from 'ui';
import {formatDate, getConversationMembers} from 'utils';
import {MessageInput} from './features/MessageInput/MessageInput';

export default function ConversationPage() {
  const me = useMyUserQuery();
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
    me.data
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
        {conversation.data?.messages.length === 0 && (
          <Text className="text-center">No messages yet...</Text>
        )}
        <div className="flex flex-col gap-2">
          {conversation.data?.messages.map(message => {
            return (
              <div
                key={message.id}
                className="flex items-center bg-gray-100 rounded-lg p-2"
              >
                <div className="grow">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Avatar
                        className="w-5 h-5"
                        src={message.user?.profileImageSrc}
                        width={100}
                        height={100}
                        alt={`${message.user?.firstName}'s profile picture`}
                      />
                      <Text data-testid="message-text">
                        <b>{message.user?.firstName}</b>
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {formatDate(message.createdAt, 'hh:mm, MMM d')}
                      </Text>
                    </div>
                    <div className="p-2">{message.text}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardBase>
      <CardBase>
        <MessageInput />
      </CardBase>
    </Container>
  );
}
