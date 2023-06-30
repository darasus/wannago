import {AddEventForm} from '../../../features/EventForm/AddEventForm';
import {Container, PageHeader} from 'ui';
import {api} from '../../../trpc/server-http';

export const metadata = {
  title: 'Add event | WannaGo',
};

export default async function EventAddPage() {
  const [me, organization] = await Promise.all([
    api.user.me.query(),
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
