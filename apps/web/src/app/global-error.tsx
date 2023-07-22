'use client';

import {captureException} from '@sentry/nextjs';
import {useEffect} from 'react';
import {ErrorComponent} from 'ui';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error);
  }, [error]);

  console.log(error);

  return (
    <html>
      <body>
        <ErrorComponent error={error} />
      </body>
    </html>
  );
}
