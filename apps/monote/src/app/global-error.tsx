'use client';

import {useEffect} from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <html>
      <body>{error.message}</body>
    </html>
  );
}
