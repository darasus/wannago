import {env} from 'client-env';
import {RouteTracker} from './RouteTracker/RouteTracker';
import {Sentry} from './Sentry/Sentry';

export async function Tools() {
  return (
    <>
      {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
        <>
          <RouteTracker />
          <Sentry />
          {/* <GoogleAnalytics /> */}
        </>
      )}
    </>
  );
}
