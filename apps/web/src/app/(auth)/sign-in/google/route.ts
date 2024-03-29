import {cookies, headers} from 'next/headers';
import type {NextRequest} from 'next/server';
import {auth, googleAuth} from 'auth';

export const GET = async (request: NextRequest) => {
  const authRequest = auth.handleRequest('GET', {headers, cookies});
  const session = await authRequest.validate();

  if (session) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  }

  const [url, state] = (await googleAuth?.getAuthorizationUrl()) || [];
  const cookieStore = cookies();

  if (url && state) {
    cookieStore.set('google_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60,
    });
  }

  return new Response(null, {
    status: 302,
    ...(url
      ? {
          headers: {
            Location: url.toString(),
          },
        }
      : {}),
  });
};
