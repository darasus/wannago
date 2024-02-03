import {api} from '../../../../trpc/server-http';

import {EventsTable} from './features/EventsTable/EventsTable';

export default async function AdminPage() {
  const events = await api.admin.getAllEvents.query();

  return <EventsTable events={events} />;
}
