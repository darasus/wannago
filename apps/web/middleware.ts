import {withClerkMiddleware, getAuth} from '@clerk/nextjs/server';
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {NextURL} from 'next/dist/server/web/next-url';
import {getBaseUrl} from './utils/getBaseUrl';

const publicPathnames = [
  '/e/',
  '/images/',
  '/register',
  '/login',
  '/api',
  '/examples',
];

const isProtectedRoute = (nextUrl: NextURL): boolean => {
  const isHomePage = nextUrl.pathname === '/';
  const isPublicPath = publicPathnames.some(path =>
    nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath || isHomePage) {
    return false;
  }

  return true;
};

export default withClerkMiddleware((request: NextRequest) => {
  const auth = getAuth(request);

  if (!auth.userId && isProtectedRoute(request.nextUrl)) {
    return NextResponse.redirect(`${getBaseUrl()}/login`);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!static|_next/static|_next/image|favicon.ico).*)'],
};
