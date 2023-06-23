import Head from 'next/head';
import {Button, Container, LoadingBlock, PageHeader} from 'ui';
import {withProtected} from '../../utils/withAuthProtect';
import {trpc} from 'trpc/src/trpc';
import {OrganizationCard} from './features/OrganizationCard/OrganizationCard';

function SettingsPage() {
  const organizations = trpc.organization.getMyOrganizations.useQuery();

  return (
    <>
      <Head>
        <title>{`Organizations | WannaGo`}</title>
      </Head>
      <Container maxSize="sm">
        <div className="flex flex-col gap-y-4">
          <PageHeader title={'Organizations'} />
          <div>
            {organizations.isInitialLoading && <LoadingBlock />}
            {organizations.data?.map(o => (
              <OrganizationCard organization={o} />
            ))}
          </div>
          {organizations.data?.length === 0 && (
            <Button>Create organization</Button>
          )}
        </div>
      </Container>
    </>
  );
}

export default withProtected(SettingsPage);
