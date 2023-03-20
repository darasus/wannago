import {useEffect, useState} from 'react';
import {init} from '@amplitude/analytics-browser';
import {env} from 'client-env';
import {useMe} from './useMe';

export function useInitiateAmplitude() {
  const {auth} = useMe();
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
