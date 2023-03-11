import {UserProfile, useUser} from '@clerk/nextjs';
import Head from 'next/head';
import {clerkAppearance} from '../clerkElements';
import {withProtected} from '../utils/withAuthProtect';

function ProfilePage() {
  const {user} = useUser();
  return (
    <>
      <Head>
        <title>{`${user?.fullName} | WannaGo`}</title>
      </Head>
      <div className="flex justify-center">
        <UserProfile appearance={clerkAppearance} />
      </div>
    </>
  );
}

export default withProtected(ProfilePage);
