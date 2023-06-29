import Link from "next/link";
import React, { Fragment } from "react";
import { Avatar, Button, CardBase, Container, PageHeader, Text } from "ui";
import { formatDate, getConversationMembers } from "utils";
import { MessageInput } from "./(features)/MessageInput/MessageInput";
import { api, getMe } from "../../../trpc/server";
import { ChevronLeft } from "lucide-react";

export default async function ConversationPage({
  params: { conversationId },
}: {
  params: { conversationId: string };
}) {
  const me = await getMe();
  await api.conversation.markConversationAsSeen.mutate({ conversationId });
  const conversation = await api.conversation.getConversationById.query({
    conversationId,
  });

  const conversationMembers = getConversationMembers(conversation, me);

  return (
    <Container className="flex flex-col gap-4" maxSize="sm">
      <Button asChild variant="outline">
        <Link href="/messages">
          <ChevronLeft /> Back to conversations
        </Link>
      </Button>
      <PageHeader
        title={
          <>
            <Text>Conversation with </Text>
            {conversationMembers.map(({ label, href }, i) => (
              <Fragment key={href}>
                <Link className="underline" href={href}>
                  {label}
                </Link>
                {conversationMembers.length - 1 === i ? "" : " & "}
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
                      <Text>
                        <b>{message.user?.firstName}</b>
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {formatDate(message.createdAt, "hh:mm, MMM d")}
                      </Text>
                    </div>
                    <div className="p-2" data-testid="message-text">
                      {message.text}
                    </div>
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
