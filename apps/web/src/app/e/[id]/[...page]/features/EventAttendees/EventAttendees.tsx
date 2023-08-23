import {PageHeader} from 'ui';
import {api} from '../../../../../../trpc/server-http';
import {AttendeesTable} from './features/AttendeesTable/AttendeesTable';

interface Props {
  eventShortId: string;
}

export async function EventAttendees({eventShortId}: Props) {
  const getAttendeesPromise = api.event.getAttendees
    .query({
      eventShortId,
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
    eventShortId: eventShortId,
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <PageHeader title="Event attendees" />
        <AttendeesTable
          eventShortId={eventShortId}
          getAllEventsAttendeesPromise={getAllEventsAttendeesPromise}
          getAttendeesPromise={getAttendeesPromise}
        />
      </div>
    </>
  );
}
