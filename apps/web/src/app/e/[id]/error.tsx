'use client';

import {captureException} from '@sentry/nextjs';
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
    captureException(error);
  }, [error]);

  return <ErrorComponent error={error} />;
}
