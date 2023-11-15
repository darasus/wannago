'use client';

import {Banner} from 'ui';
import {VerifyEmailButton} from './VerifyEmailButton';
import {User} from '@prisma/client';

interface Props {
  me: User | null;
}

export function VerifyEmailBar({me}: Props) {
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
