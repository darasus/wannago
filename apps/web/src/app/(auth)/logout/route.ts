import {auth} from 'auth';

import {NextResponse, type NextRequest} from 'next/server';
import {revalidatePath} from 'next/cache';
import * as context from 'next/headers';

export const runtime = 'nodejs';

export const GET = async (request: NextRequest) => {
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

  const url = new URL('/sign-in', request.url);

  url.searchParams.set('refresh', 'true');

  return NextResponse.redirect(url);
};
