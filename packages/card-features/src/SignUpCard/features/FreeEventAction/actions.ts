'use server';

import {api} from '../../../../../../apps/web/src/trpc/server-http';

export async function revalidateGetMySignUp({eventId}: {eventId: string}) {
  await api.event.getMySignUp.revalidate({eventId});
}
