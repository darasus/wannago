import {env} from 'client-env';
import {Sentry} from './Sentry/Sentry';
import {Analytics} from '@vercel/analytics/react';
import {api} from '../trpc/server-http';

export async function Tools() {
  const me = await api.user.me.query();
  return (
    <>
      {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
        <>
          <Sentry me={me} />
          <Analytics />
          {/* <GoogleAnalytics /> */}
        </>
      )}
    </>
  );
}
