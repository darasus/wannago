import {Button, Container, LoadingBlock, PageHeader} from 'ui';
import {ArrowLeftCircleIcon} from '@heroicons/react/24/solid';
import {api} from '../../../../trpc/server';
import {OrganizationDetailsSettings} from './(features)/OrganizationDetailsSettings/OrganizationDetailsSettings';
import {TeamMembersSettings} from './(features)/TeamMemberSettings/TeamMembersSettings';
import {Suspense} from 'react';
import {OrganizationSubscription} from './(features)/OrganizationSubscription/OrganizationSubscription';
import {StripeAccountLinkSettings} from '../../../(features)/StripeAccountLinkSettings/StripeAccountLinkSettings';

// TODO: create description text explaining why you need to create a team

export const generateMetadata = async () => {
  const organization = await api.organization.getMyOrganization.query();

  return {
    title: `${organization?.name} settings | WannaGo`,
  };
};

export default async function OrganizationSettingsPage() {
  const mySubscriptionPromise = api.subscriptionPlan.getMySubscription.query({
    type: 'BUSINESS',
  });
  const organization = await api.organization.getMyOrganization.query();

  if (!organization) {
    return null;
  }

  return (
    <>
      <Container maxSize="sm">
        <div className="flex flex-col gap-4">
          <Button
            variant="neutral"
            iconLeft={<ArrowLeftCircleIcon />}
            href="/organizations"
            as="a"
          >
            Back to organizations
          </Button>
          <PageHeader title={`${organization?.name} settings`} />
          <div className="flex flex-col gap-4">
            <OrganizationDetailsSettings organization={organization} />
            <TeamMembersSettings organization={organization} />
            <Suspense fallback={<LoadingBlock />}>
              <OrganizationSubscription
                organization={organization}
                mySubscriptionPromise={mySubscriptionPromise}
              />
            </Suspense>
            <StripeAccountLinkSettings type="BUSINESS" />
          </div>
        </div>
      </Container>
    </>
  );
}
