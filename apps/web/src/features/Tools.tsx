import {env} from 'client-env';
import {Amplitude} from './Amplitude/Amplitude';
import {Sentry} from './Sentry/Sentry';
import {GoogleAnalytics} from './GoogleAnalytics/GoogleAnalytics';
import {api} from '../trpc/server-http';

export async function Tools() {
  const userPromise = api.user.me.query();

  return (
    <>
      {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
        <>
          <Amplitude />
          <Sentry />
          <GoogleAnalytics />
        </>
      )}
    </>
  );
}
