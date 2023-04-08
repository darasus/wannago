import Link from 'next/link';
import Head from 'next/head';
import {EventCard} from 'cards';
import {LoadingEventCard} from 'cards/src/LoadingEventCard/LoadingEventCard';
import {Container, PageHeader} from 'ui';
import {trpc} from 'trpc/src/trpc';

function ExamplesPage() {
  const {isLoading, data} = trpc.event.getExamples.useQuery();

  return (
    <>
      <Head>
        <title>Examples | WannaGo</title>
      </Head>
      <Container className="flex flex-col gap-4">
        <PageHeader title="Examples" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading &&
            Array.from({length: 4}).map((_, i) => <LoadingEventCard key={i} />)}
          {data?.map(event => {
            return (
              <Link
                href={`/e/${event.shortId}`}
                key={event.id}
                data-testid="example-event-card"
              >
                <EventCard event={event} />
              </Link>
            );
          })}
        </div>
      </Container>
    </>
  );
}

export default ExamplesPage;