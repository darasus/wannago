'use server';

import {api} from '../../../../../../../../trpc/server-http';

export async function cancelEventByUserId({
  eventShortId,
  userId,
}: {
  eventShortId: string;
  userId: string;
}) {
  await api.event.cancelEventByUserId.mutate({eventShortId, userId});
  await api.event.getAttendees.revalidate();
}
