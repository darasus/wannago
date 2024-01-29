import {AddEventForm} from 'features/src/EventForm/AddEventForm';
import {Container, PageHeader} from 'ui';
import {api} from '../../../trpc/server-http';

export const metadata = {
  title: 'Add event | WannaGo',
};

export const preferredRegion = 'iad1';

export default async function EventAddPage() {
  const [me] = await Promise.all([api.user.me.query()]);

  if (!me) {
    return null;
  }

  return (
    <>
      <Container maxSize="sm" className="md:px-4">
        <PageHeader title="Create new event" className="mb-4" />
        <AddEventForm me={me} />
      </Container>
    </>
  );
}
