import {UserProfile, useUser} from '@clerk/nextjs';
import Head from 'next/head';
import {useForm} from 'react-hook-form';
import {Button, CardBase, Container, PageHeader} from 'ui';
import {clerkAppearance} from '../clerkElements';
import {Input} from '../components/Input/Input/Input';
import {EmailFormCard} from '../features/UserSettings/EmailFormCard';
import {NameFormCard} from '../features/UserSettings/NameFormCard';
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
          <NameFormCard />
          <EmailFormCard />
          <UserProfile appearance={clerkAppearance} />
        </div>
      </Container>
    </>
  );
}

export default withProtected(ProfilePage);
