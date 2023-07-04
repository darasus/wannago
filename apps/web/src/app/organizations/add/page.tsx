import {Container, PageHeader} from 'ui';
import {OrganizationForm} from '../(features)/OrganizationForm/OrganizationForm';
import {createOrganization} from './actions';

export default function CreateOrganizationPage() {
  return (
    <Container maxSize="sm">
      <div className="flex flex-col gap-4">
        <PageHeader title={'Create organization'} />
        <OrganizationForm onSubmit={createOrganization} />
      </div>
    </Container>
  );
}
