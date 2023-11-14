'use client';

import {useEffect} from 'react';
import {setContext} from '@sentry/nextjs';
import {User} from '@prisma/client';

interface Props {
  me: User | null;
}

export function Sentry({me}: Props) {
  useEffect(() => {
    if (me?.id) {
      setContext('user', {
        userId: me?.id,
      });
    }
  }, [me?.id]);

  return null;
}
