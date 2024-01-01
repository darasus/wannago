import {env} from 'client-env';

import {Analytics} from '@vercel/analytics/react';

export async function Tools() {
  return (
    <>
      {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
        <>
          <Analytics />
          {/* <GoogleAnalytics /> */}
        </>
      )}
    </>
  );
}
