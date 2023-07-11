'use server';

import {api} from '../../../../../../apps/web/src/trpc/server-http';

export async function joinEvent({
  eventId,
  hasPlusOne,
}: {
  eventId: string;
  hasPlusOne: boolean;
}) {
  await api.event.joinEvent.mutate({
    eventId,
    hasPlusOne,
  });

  await api.event.getMySignUp.revalidate();

  return true;
}

export async function cancelEvent({eventId}: {eventId: string}) {
  await api.event.cancelEvent.mutate({
    eventId,
  });

  await api.event.getMySignUp.revalidate();
  await api.event.getByShortId.revalidate();
  await api.event.getById.revalidate();
  await api.event.getMySignUp.revalidate();

  return true;
}
