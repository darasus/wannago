'use client';

import {use, useEffect} from 'react';
import {useAuth} from '@clerk/nextjs';
import {getMe} from '../../../trpc/client';

export function Intercom() {
  const auth = useAuth();
  const user = use(getMe());

  useEffect(() => {
    if (auth?.userId) {
      (window as any)?.Intercom?.('update', {
        email: user?.email,
        created_at: 1234567890,
        name: `${user?.firstName} ${user?.lastName}`,
        user_id: auth?.userId,
      });
    }
  }, [auth?.userId, user?.email, user?.firstName, user?.lastName]);

  return null;
}
