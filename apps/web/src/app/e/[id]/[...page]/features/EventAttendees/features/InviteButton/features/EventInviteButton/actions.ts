'use server';

import {api} from '../../../../../../../../../../trpc/server-http';

export async function revalidateGetAllEventsAttendees({
  eventShortId,
}: {
  eventShortId: string;
}) {
  await api.event.getAllEventsAttendees.revalidate({eventShortId});
}
