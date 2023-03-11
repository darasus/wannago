import {withClerkMiddleware} from '@clerk/nextjs/server';
import {NextResponse} from 'next/server';

export default withClerkMiddleware((req, res) => {
  const url = new URL(req.url);

  // if (url.pathname === '/api/edge-flags') {
  //   if (typeof req.geo?.city !== 'undefined') {
  //     url.searchParams.set('city', req.geo.city);
  //   }

  //   if (typeof req.geo?.country !== 'undefined') {
  //     url.searchParams.set('country', req.geo?.country);
  //   }

  //   if (typeof req.geo?.region !== 'undefined') {
  //     url.searchParams.set('region', req.geo.region);
  //   }

  //   if (typeof req.geo?.latitude !== 'undefined') {
  //     url.searchParams.set('latitude', req.geo.latitude);
  //   }

  //   if (typeof req.geo?.longitude !== 'undefined') {
  //     url.searchParams.set('longitude', req.geo.longitude);
  //   }

  //   if (typeof req.ip !== 'undefined') {
  //     url.searchParams.set('ip', req.ip);
  //   }
  // }

  return NextResponse.rewrite(url);
});

export const config = {
  matcher: ['/((?!static|_next/static|_next/image|favicon.ico).*)'],
};
