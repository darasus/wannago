import {notFound} from 'next/navigation';
import {EditEventForm} from '../../../../components/EventForm/EditEventForm';
import {api} from '../../../../lib/api';

export default async function EventPage({params}: any) {
  const event = await api.getEvent(params.id);

  if (!event) {
    notFound();
  }

  return <EditEventForm event={event} />;
}
