import {Button, Container, LoadingBlock, Text} from 'ui';
import {EventInfo} from './(features)/EventInfo/EventInfo';
import {api} from '../../../../trpc/server-http';
import {notFound} from 'next/navigation';
import {EditEventForm} from '../../../../features/EventForm/EditEventForm';
import {EventAttendees} from './(features)/EventAttendees/EventAttendees';
import {EventInvite} from './(features)/EventInvite/EventInvite';
import {MyTickets} from './(features)/MyTickets/MyTickets';
import Link from 'next/link';
import {ChevronLeft} from 'lucide-react';
import {Suspense} from 'react';

export default async function EventPages({
  params: {id, page},
}: {
  params: {id: string; page: string[]};
}) {
  const [me, event, isMyEvent, myOrganizations] = await Promise.all([
    api.user.me.query(),
    api.event.getByShortId.query({id: id}),
    api.event.getIsMyEvent.query({
      eventShortId: id,
    }),
    api.organization.getMyOrganizations.query(),
  ]);

  const allAttendeesPromise = api.event.getAllEventsAttendees.query({
    eventShortId: id,
  });

  const myEventSignUpsPromise = api.event.getMyTicketsByEvent.query({
    eventShortId: id,
  });

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
            {isMyEvent && (
              <>
                {page[0] === 'info' && (
                  <Suspense fallback={<LoadingBlock />}>
                    <EventInfo event={event} />
                  </Suspense>
                )}
                {page[0] === 'edit' && (
                  <EditEventForm
                    event={event}
                    me={me}
                    myOrganizations={myOrganizations || []}
                  />
                )}
                {page[0] === 'attendees' && (
                  <Suspense fallback={<LoadingBlock />}>
                    <EventAttendees />
                  </Suspense>
                )}
                {page[0] === 'invite' && (
                  <Suspense fallback={<LoadingBlock />}>
                    <EventInvite
                      allAttendeesPromise={allAttendeesPromise}
                      eventShortId={id}
                    />
                  </Suspense>
                )}
              </>
            )}
            {page[0] === 'my-tickets' && (
              <Suspense fallback={<LoadingBlock />}>
                <MyTickets eventSignUpsPromise={myEventSignUpsPromise} />
              </Suspense>
            )}
          </div>
        </Suspense>
      </div>
    </Container>
  );
}
