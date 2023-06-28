'use client';

import {useRouter} from 'next/navigation';
import {Container} from 'ui';
import {Login} from 'auth-features';
import {useCallback} from 'react';

function LoginPage() {
  const router = useRouter();

  const handleOnDone = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <>
      <Container maxSize="xs" className="py-4">
        <Login onDone={handleOnDone} />
      </Container>
    </>
  );
}

export default LoginPage;
