import {SignUp} from '@clerk/nextjs';
import Head from 'next/head';
import AppLayout from '../components/AppLayout/AppLayout';

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Register | WannaGo</title>
      </Head>
      <AppLayout>
        <div className="flex justify-center">
          <SignUp afterSignUpUrl={'/auth-success'} />
        </div>
      </AppLayout>
    </>
  );
}
