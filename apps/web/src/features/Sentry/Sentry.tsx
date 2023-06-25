'use client';

import {useEffect} from 'react';
import {setContext} from '@sentry/nextjs';
import {useAuth} from '@clerk/nextjs';

export function Sentry() {
  const auth = useAuth();

  useEffect(() => {
    if (auth?.userId) {
      setContext('user', {
        userId: auth?.userId,
      });
    }
  }, [auth?.userId]);

  return null;
}
