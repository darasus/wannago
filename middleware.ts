import {withClerkMiddleware} from '@clerk/nextjs/server';
import {NextResponse} from 'next/server';

export default withClerkMiddleware(() => {
  return NextResponse.next();
});

// don't run middleware running on static files
export const config = {matcher: '/((?!.*\\.).*)'};
