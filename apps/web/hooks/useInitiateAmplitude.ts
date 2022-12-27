import {useEffect, useState} from 'react';
import {init} from '@amplitude/analytics-browser';
import {useUser} from '@clerk/nextjs';
import {env} from '../lib/env/client';

export function useInitiateAmplitude() {
  const {user} = useUser();
  const [initiated, setInitiated] = useState(false);
  const [initiatedWithUser, setInitiatedWithUser] = useState(false);

  useEffect(() => {
    if (!user && !initiated) {
      init(env.NEXT_PUBLIC_AMPLITUDE_API_KEY);
      setInitiated(true);
    }
  }, [initiated, user]);

  useEffect(() => {
    if (user && !initiatedWithUser) {
      init(env.NEXT_PUBLIC_AMPLITUDE_API_KEY, user.id);
      setInitiatedWithUser(true);
    }
  }, [initiatedWithUser, user]);

  return {isInitiated: initiated || initiatedWithUser};
}
