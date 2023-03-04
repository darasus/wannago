import {SignUp} from '@clerk/nextjs';
import Head from 'next/head';
import AppLayout from '../features/AppLayout/AppLayout';

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Register | WannaGo</title>
      </Head>
      <AppLayout>
        <div className="flex justify-center">
          <SignUp afterSignUpUrl={'/dashboard'} />
        </div>
      </AppLayout>
    </>
  );
}