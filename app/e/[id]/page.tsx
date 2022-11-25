import {EventView} from '../../../components/EventView/EventView';
import {api} from '../../../lib/api';

export default async function PublicEventPage({params}: any) {
  const event = await api.getEventByNanoId(params.id);

  if (!event) {
    return null;
  }

  return <EventView event={event} myEvent={false} showManageTools={false} />;
}
