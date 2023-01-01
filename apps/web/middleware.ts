import {withClerkMiddleware} from '@clerk/nextjs/server';
import {NextRequest, NextResponse} from 'next/server';

export default withClerkMiddleware((req: NextRequest) => {
  console.log(req.nextUrl.pathname);

  if (req.nextUrl.pathname === '/api/trpc/event.getRandomExample') {
    const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

    return NextResponse.next({
      headers: {
        'Cache-Control': `s-maxage=10, stale-while-revalidate=${ONE_WEEK_IN_SECONDS}`,
      },
    });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!static|_next/static|_next/image|favicon.ico).*)'],
};
