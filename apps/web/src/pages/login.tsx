import {SignIn} from '@clerk/nextjs';
import Head from 'next/head';
import {withDashboardRedirectIfSignedIn} from '../utils/withDashboardRedirectIfSignedIn';

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

export default withDashboardRedirectIfSignedIn(LoginPage);
