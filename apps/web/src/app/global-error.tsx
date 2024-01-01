'use client';

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
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <ErrorComponent error={error} />
      </body>
    </html>
  );
}
