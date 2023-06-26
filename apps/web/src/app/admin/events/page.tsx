import {EventsTable} from './(features)/EventsTable/EventsTable';
import {api} from '../../../trpc/server';

export default async function AdminPage() {
  const events = await api.admin.getAllEvents.query();

  return <EventsTable events={events} />;
}
