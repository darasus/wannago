import {withClerkMiddleware} from '@clerk/nextjs/server';
import {NextResponse} from 'next/server';

export default withClerkMiddleware(() => {
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!static|_next/static|_next/image|favicon.ico).*)'],
};
