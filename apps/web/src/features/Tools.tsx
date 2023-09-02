import {env} from 'client-env';
import {Sentry} from './Sentry/Sentry';
import {Analytics} from '@vercel/analytics/react';

export async function Tools() {
  return (
    <>
      {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
        <>
          <Sentry />
          <Analytics />
          {/* <GoogleAnalytics /> */}
        </>
      )}
    </>
  );
}
