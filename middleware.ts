import {withClerkMiddleware, getAuth} from '@clerk/nextjs/server';
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {getBaseUrl} from './lib/api';

type VercelEnv = 'development' | 'preview' | 'production';

const loginRedirectUrl: Record<VercelEnv, string> = {
  production: 'https://accounts.wannago.app/sign-in',
  preview: `${getBaseUrl()}/login`,
  development: `${getBaseUrl()}/login`,
};

const publicPaths = ['/', '_next'];

export default withClerkMiddleware((request: NextRequest) => {
  // const auth = getAuth(request);
  // const requestHeaders = new Headers(request.headers);
  // const userId = auth?.userId || requestHeaders.get('x-user-id');

  // if (
  //   !userId &&
  //   !publicPaths.some(path => request.nextUrl.pathname.startsWith(path)) &&
  //   !request.nextUrl.pathname.startsWith('/login')
  // ) {
  //   const redirectUrl = loginRedirectUrl[process.env.VERCEL_ENV as VercelEnv];
  //   return NextResponse.redirect(redirectUrl);
  // }

  // if (userId) {
  //   requestHeaders.set('x-user-id', userId);
  // }

  // return NextResponse.next({
  //   request: {
  //     headers: requestHeaders,
  //   },
  // });

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next|static|favicon.ico).*)',
  ],
};
