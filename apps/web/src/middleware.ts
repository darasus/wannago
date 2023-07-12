import {authMiddleware} from '@clerk/nextjs';
import {NextResponse} from 'next/server';

export default authMiddleware({
  signInUrl: '/login',
  publicRoutes: [
    '/',
    '/login(.*)',
    '/register(.*)',
    '/examples(.*)',
    '/terms-of-service(.*)',
    '/privacy-policy(.*)',
    '/cookie-policy(.*)',
    '/e/(.*)',
    '/u/(.*)',
    '/o/(.*)',
    '/api/(.*)',
    '/api/trpc/(.*)',
    '/auth/callback(.*)',
    '(.*)inngest(.*)',
  ],
  async afterAuth(auth, req) {
    if (auth.isPublicRoute) {
      return NextResponse.next();
    }

    const url = new URL(req.nextUrl.origin);

    if (!auth.userId) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
