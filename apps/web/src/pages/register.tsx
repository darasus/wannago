import {SignUp} from '@clerk/nextjs';
import Head from 'next/head';

function RegisterPage() {
  return (
    <>
      <Head>
        <title>Register | WannaGo</title>
      </Head>
      <div className="flex justify-center">
        <SignUp afterSignUpUrl={'/dashboard'} />
      </div>
    </>
  );
}

export default RegisterPage;
