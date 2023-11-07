import {PageHeader} from 'ui';
import {api} from '../../../../../../trpc/server-http';
import {AttendeesTable} from './features/AttendeesTable/AttendeesTable';
import {RouterOutputs} from 'api';

interface Props {
  event: RouterOutputs['event']['getByShortId'];
}

export async function EventAttendees({event}: Props) {
  const getAttendeesPromise = api.event.getAttendees
    .query({
      eventShortId: event.shortId,
    })
    .then((res) => {
      return res.map((eventSignUp) => {
        return {
          id: eventSignUp.id,
          fullName: `${eventSignUp.user.firstName} ${eventSignUp.user.lastName}`,
          status: eventSignUp.status,
          eventShortId: eventSignUp.event.shortId,
          userId: eventSignUp.user.id,
        };
      });
    });

  const getAllEventsAttendeesPromise = api.event.getAllEventsAttendees.query({
    eventShortId: event.shortId,
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <PageHeader title="Event attendees" />
        <AttendeesTable
          event={event}
          getAllEventsAttendeesPromise={getAllEventsAttendeesPromise}
          getAttendeesPromise={getAttendeesPromise}
        />
      </div>
    </>
  );
}
