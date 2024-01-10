import {Container, LoadingCard, PageHeader} from 'ui';
import {api} from '../../trpc/server-http';
import {UserSettingsForm} from './features/UserSettingsForm/UserSettingsForm';
import {Suspense} from 'react';

export const generateMetadata = async () => {
  return {
    title: `User settings | WannaGo`,
  };
};

export default async function SettingsPage() {
  return (
    <Container maxSize="sm">
      <div className="flex flex-col gap-y-4">
        <PageHeader title={'Settings'}></PageHeader>
        <div className="flex flex-col gap-4">
          <Suspense fallback={<LoadingCard />}>
            <UserSettingsForm userPromise={api.user.me.query()} />
          </Suspense>
          {/* <Suspense fallback={<LoadingCard />}>
            <StripeSettings userPromise={api.user.me.query()} />
          </Suspense> */}
        </div>
      </div>
    </Container>
  );
}
