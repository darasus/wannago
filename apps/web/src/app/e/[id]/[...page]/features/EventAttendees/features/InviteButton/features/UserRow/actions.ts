'use server';

import {api} from '../../../../../../../../../../trpc/server-http';

export async function invite({
  userId,
  eventShortId,
}: {
  userId: string;
  eventShortId: string;
}) {
  await api.event.invitePastAttendee.mutate({userId, eventShortId});
  await api.event.getAllEventsAttendees.revalidate();
}
