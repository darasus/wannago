import {Suspense} from 'react';
import {EditEventForm} from 'features/src/EventForm/EditEventForm';
import {ChevronLeft} from 'lucide-react';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Button, Container, LoadingBlock, Text} from 'ui';

import {api} from '../../../../trpc/server-http';

import {EventAttendees} from './features/EventAttendees/EventAttendees';
import {EventInfo} from './features/EventInfo/EventInfo';

export default async function EventPages({
  params: {id, page},
}: {
  params: {id: string; page: string[]};
}) {
  const [me, event] = await Promise.all([
    api.user.me.query(),
    api.event.getByShortId.query({id: id}),
  ]);

  if (!me) {
    return null;
  }

  if (!event) {
    return notFound();
  }

  return (
    <Container maxSize="sm">
      <div className="flex flex-col gap-4">
        <Button asChild size="lg" data-testid="back-to-event-button">
          <Link href={`/e/${event?.shortId}`}>
            <ChevronLeft />
            <Text truncate>{`Back to "${event?.title}"`}</Text>
          </Link>
        </Button>
        <Suspense>
          <div>
            {event.isMyEvent && (
              <>
                {page[0] === 'info' && (
                  <Suspense fallback={<LoadingBlock />}>
                    <EventInfo event={event} />
                  </Suspense>
                )}
                {page[0] === 'edit' && <EditEventForm event={event} me={me} />}
                {page[0] === 'attendees' && (
                  <Suspense fallback={<LoadingBlock />}>
                    <EventAttendees event={event} />
                  </Suspense>
                )}
              </>
            )}
          </div>
        </Suspense>
      </div>
    </Container>
  );
}
