import Link from 'next/link';
import {EventCard} from 'cards';
import {Container, PageHeader} from 'ui';
import {api} from '../../trpc/server-http';

export const metadata = {
  title: 'Examples | WannaGo',
};

export const runtime = 'edge';
export const preferredRegion = 'iad1';

export default async function ExamplesPage() {
  const examples = await api.event.getExamples.query();

  return (
    <>
      <Container className="flex flex-col gap-4" maxSize="sm">
        <PageHeader title="Examples" />
        <div className="flex flex-col gap-4">
          {examples?.map((event) => {
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
