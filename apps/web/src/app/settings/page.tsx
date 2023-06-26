import {Container, PageHeader} from 'ui';
import {api} from '../../trpc/server';
import {UserSettings} from './(features)/UserSettings/UserSettings';

export const generateMetadata = async () => {
  const user = await api.user.me.query();

  return {
    title: `${user?.firstName} ${user?.lastName} settings | WannaGo`,
  };
};

export default async function SettingsPage() {
  const user = await api.user.me.query();
  const mySubscriptionPromise = api.subscriptionPlan.getMySubscription.query({
    type: 'PRO',
  });

  return (
    <Container maxSize="sm">
      <div className="flex flex-col gap-y-4">
        <PageHeader title={'Settings'}></PageHeader>
        {user && (
          <UserSettings
            user={user}
            mySubscriptionPromise={mySubscriptionPromise}
          />
        )}
      </div>
    </Container>
  );
}
