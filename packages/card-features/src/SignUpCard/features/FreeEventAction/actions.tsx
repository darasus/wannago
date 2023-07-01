'use server';

import {api} from '../../../../../../apps/web/src/trpc/server-http';

export async function joinEvent({
  eventId,
  hasPlusOne,
}: {
  eventId: string;
  hasPlusOne: boolean;
}) {
  'use server';
  await api.event.joinEvent.mutate({
    eventId,
    hasPlusOne,
  });

  await api.event.getMySignUp.revalidate();
}

export async function cancelEvent({eventId}: {eventId: string}) {
  'use server';
  await api.event.cancelEvent.mutate({
    eventId,
  });

  await api.event.getMySignUp.revalidate();
}

export async function getMySignUp({eventId}: {eventId: string}) {
  'use server';

  return api.event.getMySignUp.query({eventId});
}
