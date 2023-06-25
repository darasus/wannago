import Head from 'next/head';
import {Container, LoadingBlock, PageHeader} from 'ui';
import {z} from 'zod';
import {api} from '../../../trpc/server';
import {EventFilter} from './(features)/EventFilter';
import {unstable_cache} from 'next/cache';
import {Suspense} from 'react';
import {EventsList} from './(features)/EventsList';

const filterSchema = z.array(
  z
    .enum(['attending', 'organizing', 'all', 'following', 'past'])
    .optional()
    .default('all')
);

export default async function Dashboard(props: {
  params: {filter: string | undefined; past: string | undefined};
}) {
  const eventType = filterSchema.parse(props.params.filter)[0];
  // const router = useRouter();
  // const [onlyPast, setOnlyPast] = useState(false);
  // const eventType = filterSchema.parse(router.query.filter)[0] || 'all';
  const events = unstable_cache(
    () => {
      return api.event.getMyEvents.query({
        eventType: eventType === 'past' ? 'all' : eventType,
        onlyPast: eventType === 'past',
      });
    },
    [eventType],
    {tags: ['my-events']}
  )();
  // const {data, isLoading, isFetching} = useMyEventsQuery({
  //   eventType,
  //   onlyPast,
  // });
  // const haveNoEvents = data?.length === 0;
  // const isGettingCards = isLoading || isFetching;

  return (
    <>
      <Head>
        <title>Dashboard | WannaGo</title>
      </Head>
      <Container maxSize="sm" className="flex flex-col gap-y-4 md:px-4">
        <PageHeader title="My events">
          <EventFilter />
        </PageHeader>
        <Suspense fallback={<LoadingBlock />}>
          <EventsList events={events} eventType={eventType} />
        </Suspense>
      </Container>
    </>
  );
}
