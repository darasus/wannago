'use client';

import {useRouter} from 'next/navigation';
import {Container} from 'ui';
import {Login as LoginFeature} from 'auth-features';
import {useCallback} from 'react';

export function Login() {
  const router = useRouter();

  const handleOnDone = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <>
      <Container maxSize="xs" className="py-4">
        <LoginFeature onDone={handleOnDone} />
      </Container>
    </>
  );
}
