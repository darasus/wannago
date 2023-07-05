'use server';

import {eventInput} from 'api/src/routers/event/validation';
import {z} from 'zod';
import {api} from '../../trpc/server-http';

export async function updateEvent(
  args: z.infer<typeof eventInput> & {eventId: string}
) {
  const result = await api.event.update.mutate(args);

  await api.event.getByShortId.revalidate();

  return result;
}
