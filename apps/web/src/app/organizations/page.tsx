import {Button, Container, PageHeader, Text} from 'ui';
import {OrganizationCard} from './features/OrganizationCard/OrganizationCard';
import {api} from '../../trpc/server-http';
import Link from 'next/link';

export const metadata = {
  title: 'Organizations | WannaGo',
};

export default async function SettingsPage() {
  const organizations = await api.organization.getMyOrganizations.query();

  return (
    <>
      <Container maxSize="sm">
        <div className="flex flex-col gap-y-4">
          <PageHeader title={'Organizations'} />
          {organizations?.map((o) => (
            <OrganizationCard organization={o} />
          ))}
          {organizations?.length === 0 && (
            <div className="text-center">
              <Text>
                {`You don't have any organizations yet. Create one by clicking
                  button bellow.`}
              </Text>
            </div>
          )}
          <Button asChild>
            <Link href="/organizations/add">Create organization</Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
