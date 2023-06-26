import {authMiddleware} from '@clerk/nextjs';

const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/examples',
  '/terms',
  '/e/',
  '/u/',
  '/o/',
  '/api/',
  '/api/trpc/',
];

export default authMiddleware({
  publicRoutes: req => {
    return true;
  },
});

export const config = {
  // matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
  matcher: [
    '/((?!static|_next/static|_next/image|favicon.ico).*)',
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
