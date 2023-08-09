'use server';

import {api} from './trpc/server-http';

export async function revalidateFollow({
  userId,
  organizationId,
}: {
  userId: string | undefined;
  organizationId: string | undefined;
}) {
  const props = {
    userId,
    organizationId,
  };
  await api.follow.amFollowing.revalidate(props);
  await api.follow.getFollowCounts.revalidate(props);
}

export async function revalidateGetMySignUp({eventId}: {eventId: string}) {
  await api.event.getMySignUp.revalidate({eventId});
}

export async function revalidateGetConversationById({
  conversationId,
}: {
  conversationId: string;
}) {
  await api.conversation.getConversationById.revalidate({
    conversationId,
  });
}

export async function revalidateGetAttendees({
  eventShortId,
}: {
  eventShortId: string;
}) {
  await api.event.getAttendees.revalidate({eventShortId});
}

export async function revalidateGetAllEventsAttendees({
  eventShortId,
}: {
  eventShortId: string;
}) {
  await api.event.getAllEventsAttendees.revalidate({eventShortId});
}

export async function revalidateMe() {
  await api.user.me.revalidate();
}
