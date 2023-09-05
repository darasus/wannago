'use client';

import {useEffect} from 'react';
import {setContext} from '@sentry/nextjs';
import {useMe} from 'hooks';

export function Sentry() {
  const me = useMe();

  useEffect(() => {
    if (me?.id) {
      setContext('user', {
        userId: me?.id,
      });
    }
  }, [me?.id]);

  return null;
}
