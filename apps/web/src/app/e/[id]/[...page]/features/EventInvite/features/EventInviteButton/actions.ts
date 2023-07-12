'use server';

import {RouterInputs} from 'api';
import {api} from '../../../../../../../../trpc/server-http';

export async function inviteByEmail(
  input: RouterInputs['event']['inviteByEmail']
) {
  const result = await api.event.inviteByEmail.mutate(input);

  await api.event.getAllEventsAttendees.revalidate();

  return result;
}
