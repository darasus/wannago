import {Button, CardBase, Container, LoadingBlock, PageHeader} from 'ui';
import {api} from '../../../../trpc/server-http';
import {OrganizationForm} from '../../(features)/OrganizationForm/OrganizationForm';
import {TeamMembersSettings} from './(features)/TeamMemberSettings/TeamMembersSettings';
import {StripeAccountLinkSettings} from '../../../(features)/StripeAccountLinkSettings/StripeAccountLinkSettings';
import Link from 'next/link';
import {ChevronLeft} from 'lucide-react';
import {Suspense} from 'react';
import {updateOrganization} from './actions';

// TODO: create description text explaining why you need to create a team

export const generateMetadata = async ({params}: {params: {id: string}}) => {
  const organization = await api.organization.getOrganizationById.query({
    organizationId: params.id,
  });

  return {
    title: `${organization?.name} settings | WannaGo`,
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

  const membersPromise = api.organization.getMyOrganizationMembers.query();

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
          <PageHeader title={`${organization?.name} settings`} />
          <div className="flex flex-col gap-4">
            <OrganizationForm
              organization={organization}
              onSubmit={async (args) => {
                'use server';
                return updateOrganization({
                  ...args,
                  organizationId: organization.id,
                });
              }}
            />
            <Suspense
              fallback={
                <CardBase>
                  <LoadingBlock />
                </CardBase>
              }
            >
              <TeamMembersSettings
                organization={organization}
                membersPromise={membersPromise}
              />
            </Suspense>
            <StripeAccountLinkSettings organizerId={organization.id} />
          </div>
        </div>
      </Container>
    </>
  );
}
