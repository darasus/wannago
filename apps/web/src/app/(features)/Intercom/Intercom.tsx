'use client';

import {use, useEffect} from 'react';
import {RouterOutputs} from 'api';

interface Props {
  userPromise: Promise<RouterOutputs['user']['me']>;
}

export function Intercom({userPromise}: Props) {
  const user = use(userPromise);

  useEffect(() => {
    if (user?.id) {
      (window as any)?.Intercom?.('update', {
        email: user?.email,
        created_at: 1234567890,
        name: `${user?.firstName} ${user?.lastName}`,
        user_id: user?.externalId,
      });
    }
  }, [
    user?.email,
    user?.firstName,
    user?.lastName,
    user?.externalId,
    user?.id,
  ]);

  return null;
}
