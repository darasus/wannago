import {useMyOrganizationQuery} from 'hooks';
import {Button, Container, LoadingBlock, PageHeader} from 'ui';
import {withProtected} from '../../../utils/withAuthProtect';
import {ArrowLeftCircleIcon} from '@heroicons/react/24/solid';
import {OrganizationSettings} from './features/OrganizationSettings/OrganizationSettings';

// TODO: create description text explaining why you need to create a team

function OrganizationSettingsPage() {
  const organization = useMyOrganizationQuery();

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
          <PageHeader title={`${organization.data?.name} settings`} />
          {organization.isInitialLoading && <LoadingBlock />}
          {organization.data && (
            <OrganizationSettings organization={organization.data} />
          )}
        </div>
      </Container>
    </>
  );
}

export default withProtected(OrganizationSettingsPage);
