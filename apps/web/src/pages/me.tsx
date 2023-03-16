import {UserProfile, useUser} from '@clerk/nextjs';
import Head from 'next/head';
import {Container, PageHeader} from 'ui';
import {clerkAppearance} from '../clerkElements';
import {EmailSettingsCard} from '../features/UserSettings/EmailSettingsCard';
import {NameSettingsCard} from '../features/UserSettings/NameSettingsCard';
import {withProtected} from '../utils/withAuthProtect';

function ProfilePage() {
  const {user} = useUser();

  return (
    <>
      <Head>
        <title>{`${user?.fullName} | WannaGo`}</title>
      </Head>
      <Container maxSize="sm">
        <div className="flex flex-col gap-y-4">
          <PageHeader title="Settings" />
          <NameSettingsCard />
          <EmailSettingsCard />
          <UserProfile appearance={clerkAppearance} />
        </div>
      </Container>
    </>
  );
}

export default withProtected(ProfilePage);
