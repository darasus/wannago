import {useEffect} from 'react';
import {useMyUser} from 'hooks';
import {useAuth} from '@clerk/nextjs';

export function Intercom() {
  const auth = useAuth();
  const user = useMyUser();

  useEffect(() => {
    if (auth?.userId) {
      (window as any)?.Intercom?.('update', {
        email: user.data?.email,
        created_at: 1234567890,
        name: `${user.data?.firstName} ${user.data?.lastName}`,
        user_id: auth?.userId,
      });
    }
  }, [
    auth?.userId,
    user.data?.email,
    user.data?.firstName,
    user.data?.lastName,
  ]);

  return null;
}
