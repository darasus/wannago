import {env} from 'client-env';
import {Amplitude} from '../../features/Amplitude/Amplitude';
import {Intercom} from '../../features/Intercom/Intercom';
import {Sentry} from '../../features/Sentry/Sentry';

export function Tools() {
  return (
    <>
      {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
        <>
          <Amplitude />
          <Sentry />
          <Intercom />
        </>
      )}
    </>
  );
}
