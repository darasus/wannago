import {notFound} from 'next/navigation';
import {EditEventForm} from '../../../../components/EventForm/EditEventForm';
import {prisma} from '../../../../lib/prisma';

export default async function EventPage({params}: any) {
  const event = await prisma.event.findFirst({where: {id: params.id}});

  if (!event) {
    notFound();
  }

  return <EditEventForm event={event} />;
}
