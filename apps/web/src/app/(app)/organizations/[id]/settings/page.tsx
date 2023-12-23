import {Button, Container, LoadingCard, PageHeader} from 'ui';
import {api} from '../../../../../trpc/server-http';
import {OrganizationForm} from '../../features/OrganizationForm/OrganizationForm';
import {TeamMembersSettings} from './features/TeamMemberSettings/TeamMembersSettings';
import Link from 'next/link';
import {ChevronLeft} from 'lucide-react';
import {Suspense} from 'react';
import {StripeAccountLinkSettings} from '../../../../../features/StripeAccountLinkSettings/StripeAccountLinkSettings';

// TODO: create description text explaining why you need to create a organization

export const generateMetadata = async ({params}: {params: {id: string}}) => {
  return {
    title: `Organization settings | WannaGo`,
  };
};

export default async function OrganizationSettingsPage({
  params,
}: {
  params: {id: string};
}) {
  const organization = await api.organization.getOrganizationById.query({
    organizationId: params.id,
  });

  if (!organization) {
    return null;
  }

  const membersPromise = api.organization.getMyOrganizationMembers.query({
    organizationId: organization.id,
  });
  const stripeAccountPromise = api.stripeAccountLink.getAccount.query({
    organizerId: organization.id,
  });

  return (
    <>
      <Container maxSize="sm">
        <div className="flex flex-col gap-4">
          <Button asChild>
            <Link href="/organizations">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to organizations
            </Link>
          </Button>
          <PageHeader title="Organization settings" />
          <div className="flex flex-col gap-4">
            <OrganizationForm organization={organization} />
            <Suspense fallback={<LoadingCard />}>
              <TeamMembersSettings
                organization={organization}
                membersPromise={membersPromise}
              />
            </Suspense>
            <Suspense fallback={<LoadingCard />}>
              <StripeAccountLinkSettings
                stripeAccountPromise={stripeAccountPromise}
                organizerId={organization.id}
              />
            </Suspense>
          </div>
        </div>
      </Container>
    </>
  );
}
