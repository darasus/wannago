import {captureException} from '@sentry/nextjs';
import {createContext} from 'api/src/context';
import {authRouter} from 'api/src/routers/auth';
import {auth} from 'auth';
import {cookies} from 'next/headers';
import {NextRequest} from 'next/server';

export async function GET(
  req: NextRequest,
  {params}: {params: {code: string}}
) {
  const authRequest = auth.handleRequest({
    request: req,
    cookies: cookies,
  });
  const ctx = await createContext({authRequest});
  const caller = authRouter.createCaller(ctx);

  try {
    await caller.verifyEmail({
      code: params.code,
    });
  } catch (error) {
    captureException(error);
  }

  return new Response(null, {status: 302, headers: {Location: '/dashboard'}});
}
