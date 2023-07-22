import {Container, LoadingCard, PageHeader} from 'ui';
import {api} from '../../trpc/server-http';
import {UserSettingsForm} from './features/UserSettingsForm/UserSettingsForm';
import {Suspense} from 'react';
import {StripeSettings} from './features/StripeSettings/StripeSettings';

export const runtime = 'edge';
export const preferredRegion = 'iad1';

export const generateMetadata = async () => {
  return {
    title: `User settings | WannaGo`,
  };
};

export default async function SettingsPage() {
  const userPromise = api.user.me.query();

  return (
    <Container maxSize="sm">
      <div className="flex flex-col gap-y-4">
        <PageHeader title={'Settings'}></PageHeader>
        <div className="flex flex-col gap-4">
          <Suspense fallback={<LoadingCard />}>
            <UserSettingsForm userPromise={userPromise} />
          </Suspense>
          <Suspense fallback={<LoadingCard />}>
            <StripeSettings userPromise={userPromise} />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
