import {EventsTable} from './features/EventsTable/EventsTable';
import {api} from '../../../../trpc/server-http';

export const runtime = 'edge';
export const preferredRegion = 'iad1';

export default async function AdminPage() {
  const events = await api.admin.getAllEvents.query();

  return <EventsTable events={events} />;
}
