import {Button, Container, PageHeader} from 'ui';
import {api} from '../../../../trpc/server-http';
import {OrganizationForm} from '../../(features)/OrganizationForm/OrganizationForm';
import {TeamMembersSettings} from './(features)/TeamMemberSettings/TeamMembersSettings';
import {StripeAccountLinkSettings} from '../../../(features)/StripeAccountLinkSettings/StripeAccountLinkSettings';
import Link from 'next/link';
import {ChevronLeft} from 'lucide-react';

// TODO: create description text explaining why you need to create a team

export const generateMetadata = async () => {
  const organization = await api.organization.getMyOrganization.query();

  return {
    title: `${organization?.name} settings | WannaGo`,
  };
};

export default async function OrganizationSettingsPage() {
  const organization = await api.organization.getMyOrganization.query();

  if (!organization) {
    return null;
  }

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
            <OrganizationForm organization={organization} />
            <TeamMembersSettings organization={organization} />
            <StripeAccountLinkSettings type="BUSINESS" />
          </div>
        </div>
      </Container>
    </>
  );
}
