import {OrganizationSwitcher, useUser} from '@clerk/nextjs';
import Head from 'next/head';
import {Container, PageHeader, Text} from 'ui';
import {EmailSettingsCard} from '../features/UserSettings/EmailSettingsCard';
import {NameSettingsCard} from '../features/UserSettings/NameSettingsCard';
import {ProfilePictureSettingsCard} from '../features/UserSettings/ProfilePictureSettingsCard';
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
          <ProfilePictureSettingsCard />
          <EmailSettingsCard />
          <OrganizationSwitcher />
        </div>
      </Container>
    </>
  );
}

export default withProtected(ProfilePage);
