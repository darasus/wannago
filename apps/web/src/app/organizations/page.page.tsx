import Head from 'next/head';
import {Button, Container, PageHeader} from 'ui';
import {OrganizationCard} from './(features)/OrganizationCard/OrganizationCard';
import {api} from '../../trpc/server';

export default async function SettingsPage() {
  const organizations = await api.organization.getMyOrganizations.query();

  return (
    <>
      <Head>
        <title>{`Organizations | WannaGo`}</title>
      </Head>
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
