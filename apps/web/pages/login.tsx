import {SignIn} from '@clerk/nextjs';
import Head from 'next/head';
import AppLayout from '../components/AppLayout/AppLayout';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | WannaGo</title>
      </Head>
      <AppLayout>
        <div className="flex justify-center">
          <SignIn redirectUrl={'/dashboard'} signUpUrl={'/register'} />
        </div>
      </AppLayout>
    </>
  );
}
