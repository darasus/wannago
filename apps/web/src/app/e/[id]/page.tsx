import {Container, LoadingBlock} from 'ui';
import {api} from '../../../trpc/server-http';
import {ManageEventButton} from './(features)/ManageEventButton/ManageEventButton';
import {EventView} from '../../../features/EventView/EventView';
import {Suspense} from 'react';

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
  const [me, isMyEvent] = await Promise.all([
    api.user.me.query(),
    api.event.getIsMyEvent.query({
      eventShortId: id,
    }),
  ]);

  const eventPromise = api.event.getByShortId.query({id});

  return (
    <Suspense fallback={<LoadingBlock />}>
      <Container className="flex flex-col gap-4" maxSize="sm">
        {isMyEvent && <ManageEventButton eventPromise={eventPromise} />}
        <EventView eventPromise={eventPromise} isMyEvent={isMyEvent} me={me} />
      </Container>
    </Suspense>
  );
}
