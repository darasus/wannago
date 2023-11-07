'use client';

import {TRPCClientError} from '@trpc/client';
import {AppRouter} from '../../../api/index';
import {Container} from '../Container/Container';
import {Ban} from 'lucide-react';

export function ErrorComponent({
  error,
}: {
  error: TRPCClientError<AppRouter> | Error;
}) {
  return (
    <Container maxSize="sm">
      <div className="flex flex-col items-center">
        <Ban className="w-20 h-20 text-red-400" />
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        {error.message && (
          <div>
            <p>
              <span className="text-gray-400">Message:</span> {error.message}
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
