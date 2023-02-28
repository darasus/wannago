import Link from 'next/link';
import Head from 'next/head';
import AppLayout from '../features/AppLayout/AppLayout';
import {EventCard} from 'cards';
import {LoadingEventCard} from 'cards/src/LoadingEventCard/LoadingEventCard';
import {Container} from 'ui';
import {trpc} from 'trpc/src/trpc';

export default function ExamplesPage() {
  const {isLoading, data} = trpc.event.getExamples.useQuery();

  return (
    <>
      <Head>
        <title>Examples | WannaGo</title>
      </Head>
      <AppLayout>
        <Container className="md:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading &&
              Array.from({length: 4}).map((_, i) => (
                <LoadingEventCard key={i} />
              ))}
            {data?.map(event => {
              return (
                <Link
                  href={`/e/${event.shortId}`}
                  key={event.id}
                  data-testid="example-event-card"
                  target={'_blank'}
                >
                  <EventCard event={event} />
                </Link>
              );
            })}
          </div>
        </Container>
      </AppLayout>
    </>
  );
}
