import {withClerkMiddleware, getAuth} from '@clerk/nextjs/server';
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {NextURL} from 'next/dist/server/web/next-url';
import {getBaseUrl} from './utils/getBaseUrl';

type VercelEnv = 'development' | 'preview' | 'production';

const loginRedirectUrl: Record<VercelEnv, string> = {
  production: 'https://accounts.wannago.app/sign-in',
  preview: `${getBaseUrl()}/login`,
  development: `${getBaseUrl()}/login`,
};

const isProtectedRoute = (nextUrl: NextURL): boolean => {
  const isHomePage = nextUrl.pathname === '/';
  const isPublicEventPage = nextUrl.pathname.startsWith('/e/');
  const isStaticImagePath = nextUrl.pathname.startsWith('/images/');
  const isGetEventByNanoId = nextUrl.pathname.startsWith(
    '/api/trpc/event.getEventByNanoId'
  );
  const isRegistrationPage = nextUrl.pathname.startsWith('/register');
  const webhook = nextUrl.pathname.startsWith('/api/user');

  if (webhook) {
    return false;
  }

  if (isStaticImagePath) {
    return false;
  }

  if (isRegistrationPage) {
    return false;
  }

  if (isHomePage) {
    return false;
  }

  if (isPublicEventPage) {
    return false;
  }

  if (isGetEventByNanoId) {
    return false;
  }

  return true;
};

export default withClerkMiddleware((request: NextRequest) => {
  const auth = getAuth(request);
  const requestHeaders = new Headers(request.headers);
  // const userId = auth?.userId || requestHeaders.get('x-user-id');
  const isLoginPage = request.nextUrl.pathname === '/login';

  if (!auth.userId && !isLoginPage && isProtectedRoute(request.nextUrl)) {
    const redirectUrl = loginRedirectUrl[process.env.VERCEL_ENV as VercelEnv];
    return NextResponse.redirect(redirectUrl);
  }

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
    '/((?!static|_next|_next/image|favicon.ico).*)',
  ],
};
