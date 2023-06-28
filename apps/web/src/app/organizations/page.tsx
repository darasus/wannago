import {Button, Container, PageHeader} from 'ui';
import {OrganizationCard} from './(features)/OrganizationCard/OrganizationCard';
import {api} from '../../trpc/server';

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
          <div>
            {organizations?.map(o => (
              <OrganizationCard organization={o} />
            ))}
          </div>
          {organizations?.length === 0 && <Button>Create organization</Button>}
        </div>
      </Container>
    </>
  );
}
