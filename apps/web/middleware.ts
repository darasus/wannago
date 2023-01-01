import {withClerkMiddleware} from '@clerk/nextjs/server';
import {NextRequest, NextResponse} from 'next/server';
import {ONE_WEEK_IN_SECONDS} from './constants';

export default withClerkMiddleware((req: NextRequest) => {
  console.log(req.nextUrl.pathname);

  if (req.nextUrl.pathname === '/api/trpc/event.getRandomExample') {
    const response = NextResponse.next();

    response.headers.set(
      'Cache-Control',
      `s-maxage=10, stale-while-revalidate=${ONE_WEEK_IN_SECONDS}`
    );

    return response;
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!static|_next/static|_next/image|favicon.ico).*)'],
};
