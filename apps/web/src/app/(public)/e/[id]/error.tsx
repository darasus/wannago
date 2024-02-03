'use client';

import {TRPCClientError} from '@trpc/client';
import {AppRouter} from 'api';
import {useEffect} from 'react';
import {ErrorComponent} from 'ui';

export default function Error({
  error,
  reset,
}: {
  error: TRPCClientError<AppRouter> | Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorComponent error={error} />;
}
