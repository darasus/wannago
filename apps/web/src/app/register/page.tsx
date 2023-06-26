'use client';

import {useRouter} from 'next/navigation';
import {useCallback} from 'react';
import {Container} from 'ui';
import {Register} from 'auth-features';

function RegisterPage() {
  const router = useRouter();

  const handleOnDone = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <>
      <Container maxSize="xs" className="py-4">
        <Register onDone={handleOnDone} />
      </Container>
    </>
  );
}

export default RegisterPage;
