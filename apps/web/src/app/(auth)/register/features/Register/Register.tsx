'use client';

import {useRouter} from 'next/navigation';
import {useCallback} from 'react';
import {Container} from 'ui';
import {Register as RegisterFeature} from 'auth-features';

export function Register() {
  const router = useRouter();

  const handleOnDone = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <>
      <Container maxSize="xs" className="py-4">
        <RegisterFeature onDone={handleOnDone} />
      </Container>
    </>
  );
}
