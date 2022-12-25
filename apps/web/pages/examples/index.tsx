import Link from 'next/link';
import Head from 'next/head';
import AppLayout from '../../components/AppLayout/AppLayout';
import {EventCard} from '../../components/Card/EventCard/EventCard';
import {LoadingEventCard} from '../../components/Card/LoadingEventCard/LoadingEventCard';
import {Container} from '../../components/Container/Container';
import {trpc} from '../../utils/trpc';

export default function ExamplesPage() {
  const {isLoading, data} = trpc.event.getExamples.useQuery();

  return (
    <>
      <Head>
        <title>Examples | WannaGo</title>
      </Head>
      <AppLayout>
        <Container className="md:px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading &&
              Array.from({length: 3}).map((_, i) => (
                <LoadingEventCard key={i} />
              ))}
            {data?.map(event => {
              return (
                <Link
                  href={`/examples/${event.id}`}
                  key={event.id}
                  data-testid="example-event-card"
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
