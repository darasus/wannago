import Head from 'next/head';
import {useRouter} from 'next/router';
import {useCallback} from 'react';
import {Container} from 'ui';
import {Register} from '../features/Register/Register';

function RegisterPage() {
  const router = useRouter();

  const handleOnDone = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <>
      <Head>
        <title>Sign up | WannaGo</title>
      </Head>
      <Container maxSize="xs" className="py-4">
        <Register onDone={handleOnDone} />
      </Container>
    </>
  );
}

export default RegisterPage;
