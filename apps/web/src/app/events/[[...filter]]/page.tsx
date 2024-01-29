import {Container, LoadingBlock, PageHeader} from 'ui';
import {z} from 'zod';
import {api} from '../../../trpc/server-http';
import {EventFilter} from './features/EventFilter';
import {Suspense} from 'react';
import {EventsList} from './features/EventsList';

const filterSchema = z.array(
  z.enum(['attending', 'organizing', 'all', 'past']).optional().default('all')
);

export const metadata = {
  title: 'My events | WannaGo',
};

export default async function Dashboard(props: {
  params: {filter: string | undefined; past: string | undefined};
}) {
  const eventType = filterSchema.parse(props.params.filter)[0];
  const events = api.event.getMyEvents.query({
    onlyPast: eventType === 'past',
  });

  return (
    <Container maxSize="sm" className="flex flex-col gap-y-4 md:px-4">
      <PageHeader title="Events">
        <EventFilter />
      </PageHeader>
      <Suspense fallback={<LoadingBlock />}>
        <EventsList events={events} eventType={eventType} />
      </Suspense>
    </Container>
  );
}
