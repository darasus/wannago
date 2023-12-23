import {Button, Text} from 'ui';
import {OrganizationCard} from './features/OrganizationCard/OrganizationCard';
import {api} from '../../../trpc/server-http';
import Link from 'next/link';
import {PageContainer} from '../PageContainer';

export const metadata = {
  title: 'Organizations | WannaGo',
};

const buttonLabel = 'Create organization';

export default async function SettingsPage() {
  const organizations = await api.organization.getMyOrganizations.query();

  return (
    <PageContainer
      title="Organizations"
      headerChildren={
        <Button asChild>
          <Link href="/organizations/add">{buttonLabel}</Link>
        </Button>
      }
    >
      <div className="flex flex-col gap-y-4">
        {organizations?.map((o) => <OrganizationCard organization={o} />)}
        {organizations?.length === 0 && (
          <div className="text-center">
            <Text>{`You don't have any organizations yet.`}</Text>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
