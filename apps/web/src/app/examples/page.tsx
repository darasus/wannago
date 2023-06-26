import Link from 'next/link';
import {EventCard} from 'cards';
import {Container, PageHeader} from 'ui';
import {api} from '../../trpc/server';

export const metadata = {
  title: 'Examples | WannaGo',
};

export default async function ExamplesPage() {
  const examples = await api.event.getExamples.query();

  return (
    <>
      <Container className="flex flex-col gap-4">
        <PageHeader title="Examples" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examples?.map(event => {
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
