import {auth} from 'auth';

import {revalidatePath} from 'next/cache';
import * as context from 'next/headers';
import {redirect} from 'next/navigation';

export const runtime = 'nodejs';

export default async function Logout() {
  const authRequest = auth.handleRequest('GET', context);
  // check if user is authenticated
  const session = await authRequest.validate();

  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }
  // make sure to invalidate the current session!
  await auth.invalidateSession(session.sessionId);

  // delete session cookie
  authRequest.setSession(null);

  revalidatePath('/', 'layout');

  redirect('/sign-in?refresh=true');
}
