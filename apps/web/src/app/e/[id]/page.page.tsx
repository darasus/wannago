import {Container} from 'ui';
import {api} from '../../../trpc/server';
import {notFound} from 'next/navigation';
import {ManageEventButton} from './(features)/ManageEventButton/ManageEventButton';
import {EventView} from '../../../features/EventView/EventView';

export async function generateMetadata({params: {id}}: {params: {id: string}}) {
  const event = await api.event.getByShortId.query({id});

  return {
    title: `${event?.title} | WannaGo`,
  };
}

export default async function EventPage({
  params: {id},
}: {
  params: {id: string};
}) {
  const me = await api.user.me.query();
  const event = await api.event.getByShortId.query({id: id});
  const isMyEvent = await api.event.getIsMyEvent.query({
    eventShortId: id,
  });

  if (!event) {
    return notFound();
  }

  if (event.isPublished === false && isMyEvent?.isMyEvent === false) {
    return notFound();
  }

  return (
    <Container className="flex flex-col gap-4" maxSize="sm">
      {isMyEvent.isMyEvent && <ManageEventButton event={event} />}
      <EventView event={event} isMyEvent={isMyEvent?.isMyEvent} />
    </Container>
  );
}
