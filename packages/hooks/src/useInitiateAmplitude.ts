'use client';

import {useEffect, useState} from 'react';
import {init} from '@amplitude/analytics-browser';
import {env} from 'client-env';
import {useMe} from './useMe';

export function useInitiateAmplitude() {
  const me = useMe();
  const [isInitiated, setInitiated] = useState(false);

  useEffect(() => {
    init(env.NEXT_PUBLIC_AMPLITUDE_API_KEY, me?.id || undefined).promise.then(
      () => {
        setInitiated(true);
      }
    );
  }, [me?.id]);

  return {isInitiated};
}
