import {env} from 'client-env';
import {Amplitude} from './Amplitude/Amplitude';
import {Intercom} from './Intercom/Intercom';
import {Sentry} from './Sentry/Sentry';
import {GoogleAnalytics} from './GoogleAnalytics/GoogleAnalytics';

export function Tools() {
  return (
    <>
      {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
        <>
          <Amplitude />
          <Sentry />
          <Intercom />
          <GoogleAnalytics />
        </>
      )}
    </>
  );
}
