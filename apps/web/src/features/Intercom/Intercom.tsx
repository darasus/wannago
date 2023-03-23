import {useEffect} from 'react';
import {useMe} from 'hooks';

export function Intercom() {
  const {auth} = useMe();
  const {me} = useMe();

  useEffect(() => {
    if (auth?.userId) {
      (window as any)?.Intercom('update', {
        email: me?.email,
        created_at: 1234567890,
        name: `${me?.firstName} ${me?.lastName}`,
        user_id: auth?.userId,
      });
    }
  }, [auth?.userId, me?.email, me?.firstName, me?.lastName]);

  return null;
}
