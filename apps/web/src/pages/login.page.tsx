import Head from 'next/head';
import {useRouter} from 'next/router';
import {Container} from 'ui';
import {Login} from '../features/Login/Login';
import {useCallback} from 'react';

function LoginPage() {
  const router = useRouter();

  const handleOnDone = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <>
      <Head>
        <title>Login | WannaGo</title>
      </Head>
      <Container maxSize="xs" className="py-4">
        <Login onDone={handleOnDone} />
      </Container>
    </>
  );
}

export default LoginPage;
