import {AddEventForm} from '../../../features/EventForm/AddEventForm';
import {Container, PageHeader} from 'ui';
import {api, getMe} from '../../../trpc/server';

export const metadata = {
  title: 'Add event | WannaGo',
};

export default async function EventAddPage() {
  const [me, organization] = await Promise.all([
    getMe(),
    api.organization.getMyOrganization.query(),
  ]);

  if (!me) {
    return null;
  }

  return (
    <>
      <Container maxSize="sm" className="md:px-4">
        <PageHeader title="Create new event" className="mb-4" />
        <AddEventForm me={me} organization={organization} />
      </Container>
    </>
  );
}
