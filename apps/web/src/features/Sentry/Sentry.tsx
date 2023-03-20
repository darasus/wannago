import {useEffect, useState} from 'react';
import {setContext} from '@sentry/nextjs';
import {useMe} from 'hooks';

export function Sentry() {
  const {auth} = useMe();

  useEffect(() => {
    if (auth?.userId) {
      setContext('user', {
        userId: auth?.userId,
      });
    }
  }, [auth?.userId]);

  return null;
}
