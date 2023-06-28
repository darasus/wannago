'use client';

import {useEffect, useState} from 'react';
import {init} from '@amplitude/analytics-browser';
import {env} from 'client-env';
import {useAuth} from '@clerk/nextjs';

export function useInitiateAmplitude() {
  const auth = useAuth();
  const [isInitiated, setInitiated] = useState(false);

  useEffect(() => {
    init(
      env.NEXT_PUBLIC_AMPLITUDE_API_KEY,
      auth?.userId || undefined
    ).promise.then(() => {
      setInitiated(true);
    });
  }, [auth.userId]);

  return {isInitiated};
}
