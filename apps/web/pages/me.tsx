import {UserProfile, useUser} from '@clerk/nextjs';
import Head from 'next/head';
import {clerkAppearance} from '../clerkElements';
import AppLayout from '../components/AppLayout/AppLayout';

export default function RegisterPage() {
  const {user} = useUser();
  return (
    <>
      <Head>
        <title>{`${user?.fullName} | WannaGo`}</title>
      </Head>
      <AppLayout>
        <div className="flex justify-center">
          <UserProfile appearance={clerkAppearance} />
        </div>
      </AppLayout>
    </>
  );
}
