import {Banner} from 'ui';
import {api} from '../../trpc/server-http';
import {VerifyEmailButton} from './VerifyEmailButton';

export async function VerifyEmailBar() {
  const me = await api.user.me.query();

  if (!me) {
    return null;
  }

  if (me?.email_verified) {
    return null;
  }

  return (
    <Banner variant="warning">
      Please verify your email. <VerifyEmailButton />
    </Banner>
  );
}
