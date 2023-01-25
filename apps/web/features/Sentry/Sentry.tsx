import {useEffect, useState} from 'react';
import {setContext} from '@sentry/nextjs';
import {useUser} from '@clerk/nextjs';

export function Sentry() {
  const {user} = useUser();
  const [isUserIdAdded, setIsUserIdAdded] = useState(false);

  useEffect(() => {
    if (!isUserIdAdded && user?.id) {
      setContext('user', {
        userId: user.id,
      });
      setIsUserIdAdded(true);
    }
  }, [isUserIdAdded, user?.id]);

  return null;
}
