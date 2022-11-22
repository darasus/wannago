import {withClerkMiddleware, getAuth} from '@clerk/nextjs/server';
import {NextRequest, NextResponse} from 'next/server';

export default withClerkMiddleware((request: NextRequest) => {
  const auth = getAuth(request);
  const requestHeaders = new Headers(request.headers);
  const userId = auth.userId || requestHeaders.get('x-user-id');

  if (userId) {
    requestHeaders.set('x-user-id', userId);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

// don't run middleware running on static files
export const config = {matcher: '/((?!.*\\.).*)'};
