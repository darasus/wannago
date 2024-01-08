import {Container, LoadingCard, PageHeader} from 'ui';
import {api} from '../../trpc/server-http';
import {UserSettingsForm} from './features/UserSettingsForm/UserSettingsForm';
import {Suspense} from 'react';
import {StripeSettings} from './features/StripeSettings/StripeSettings';
import {OrganizationForm} from './features/OrganizationForm/OrganizationForm';
import {OrganizationMemberSettings} from './features/OrganizationMemberSettings/OrganizationMemberSettings';

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
          <Suspense fallback={<LoadingCard />}>
            <OrganizationForm
              organizationPromise={api.organization.getMyOrganization.query()}
            />
          </Suspense>
          <Suspense fallback={<LoadingCard />}>
            <OrganizationMemberSettings
              organizationPromise={api.organization.getMyOrganization.query()}
              membersPromise={api.organization.getMyOrganizationMembers.query()}
            />
          </Suspense>
          <Suspense fallback={<LoadingCard />}>
            <StripeSettings userPromise={api.user.me.query()} />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
