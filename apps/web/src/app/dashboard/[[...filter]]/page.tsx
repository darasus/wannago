import {Container, LoadingBlock, PageHeader} from 'ui';
import {z} from 'zod';
import {api} from '../../../trpc/server';
import {EventFilter} from './(features)/EventFilter';
import {Suspense} from 'react';
import {EventsList} from './(features)/EventsList';

const filterSchema = z.array(
  z
    .enum(['attending', 'organizing', 'all', 'following', 'past'])
    .optional()
    .default('all')
);

export const metadata = {
  title: 'Dashboard | WannaGo',
};

export default async function Dashboard(props: {
  params: {filter: string | undefined; past: string | undefined};
}) {
  const eventType = filterSchema.parse(props.params.filter)[0];
  const events = api.event.getMyEvents.query({
    eventType: eventType === 'past' ? 'all' : eventType,
    onlyPast: eventType === 'past',
  });

  return (
    <Container maxSize="sm" className="flex flex-col gap-y-4 md:px-4">
      <PageHeader title="My events">
        <EventFilter />
      </PageHeader>
      <Suspense fallback={<LoadingBlock />}>
        <EventsList events={events} eventType={eventType} />
      </Suspense>
    </Container>
  );
}
