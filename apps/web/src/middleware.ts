import {authMiddleware} from '@clerk/nextjs';
import {NextResponse} from 'next/server';

const publicRoutes = [
  '/login',
  '/register',
  '/examples',
  '/terms-of-service',
  '/privacy-policy',
  '/cookie-policy',
  '/e/',
  '/u/',
  '/o/',
  '/api/',
  '/api/trpc/',
  '/auth/callback',
];

export default authMiddleware({
  publicRoutes: (req) => {
    if (req.nextUrl.pathname.includes('inngest')) {
      return true;
    }

    if (req.nextUrl.pathname === '/') {
      return true;
    }

    return publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route));
  },
  beforeAuth(req, evt) {
    if (req.nextUrl.pathname.includes('api/pdf-ticket')) {
      return false;
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    '/((?!static|_next/static|_next/image|favicon.ico).*)',
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
