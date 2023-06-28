import {ArrowLeftCircleIcon} from '@heroicons/react/24/solid';
import {Button, Container, Text} from 'ui';
import {EventInfo} from './(features)/EventInfo/EventInfo';
import {api, getMe} from '../../../../trpc/server';
import {notFound} from 'next/navigation';
import {EditEventForm} from '../../../../features/EventForm/EditEventForm';
import {EventAttendees} from './(features)/EventAttendees/EventAttendees';
import {EventInvite} from './(features)/EventInvite/EventInvite';
import {MyTickets} from './(features)/MyTickets/MyTickets';

export default async function EventPages({
  params: {id, page},
}: {
  params: {id: string; page: string[]};
}) {
  const [me, event, isMyEvent, myOrganization] = await Promise.all([
    getMe(),
    api.event.getByShortId.query({id: id}),
    api.event.getIsMyEvent.query({
      eventShortId: id,
    }),
    api.organization.getMyOrganization.query(),
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
        <Button
          variant="neutral"
          iconLeft={<ArrowLeftCircleIcon />}
          href={`/e/${event?.shortId}`}
          as="a"
          data-testid="back-to-event-button"
        >
          <Text truncate>{`Back to "${event?.title}"`}</Text>
        </Button>
        <div>
          {isMyEvent?.isMyEvent && (
            <>
              {page[0] === 'info' && <EventInfo event={event} />}
              {page[0] === 'edit' && (
                <EditEventForm
                  event={event}
                  me={me}
                  organization={myOrganization}
                />
              )}
              {page[0] === 'attendees' && <EventAttendees />}
              {page[0] === 'invite' && <EventInvite />}
            </>
          )}
          {page[0] === 'my-tickets' && <MyTickets />}
        </div>
      </div>
    </Container>
  );
}
