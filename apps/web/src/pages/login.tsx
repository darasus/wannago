import {SignIn} from '@clerk/nextjs';
import Head from 'next/head';

function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | WannaGo</title>
      </Head>
      <div className="flex justify-center">
        <SignIn redirectUrl={'/dashboard'} signUpUrl={'/register'} />
      </div>
    </>
  );
}

export default LoginPage;
