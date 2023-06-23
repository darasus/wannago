import {withProtected} from '../../../utils/withAuthProtect';
import {EventsTable} from './(features)/EventsTable/EventsTable';
import {api} from '../../../trpc/server';

async function AdminPage() {
  const events = await api.admin.getAllEvents.query();

  return <EventsTable events={events} />;
}

export default withProtected(AdminPage);
