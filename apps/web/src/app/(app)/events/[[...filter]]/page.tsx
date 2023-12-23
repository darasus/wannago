import {LoadingBlock} from 'ui';
import {z} from 'zod';
import {api} from '../../../../trpc/server-http';
import {Suspense} from 'react';
import {EventsList} from './features/EventsList';
import {PageContainer} from '../../PageContainer';
import {EventFilter} from './features/EventFilter';

const filterSchema = z.array(
  z
    .enum(['attending', 'organizing', 'all', 'following', 'past'])
    .optional()
    .default('all')
);

export const metadata = {
  title: 'My events | WannaGo',
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
    <PageContainer headerChildren={<EventFilter />} title="Events">
      <Suspense fallback={<LoadingBlock />}>
        <EventsList events={events} eventType={eventType} />
      </Suspense>
    </PageContainer>
  );
}
