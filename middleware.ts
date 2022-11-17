import {withClerkMiddleware} from '@clerk/nextjs/server';
import {NextRequest, NextResponse} from 'next/server';

export default withClerkMiddleware((req: any) => {
  return NextResponse.next();
});

// don't run middleware running on static files
export const config = {matcher: '/((?!.*\\.).*)'};
