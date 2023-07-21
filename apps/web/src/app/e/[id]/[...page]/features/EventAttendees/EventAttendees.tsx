import {Text, PageHeader, LoadingBlock} from 'ui';
import {MessageParticipantsButton} from './features/MessageParticipantsButton/MessageParticipantsButton';
import {ExportAttendeesCSV} from './features/ExportAttendeesCSV/ExportAttendeesCSV';
import {api} from '../../../../../../trpc/server-http';
import {InviteButton} from './features/InviteButton/InviteButton';
import {EventAttendeeItem} from './features/EventAttendeeItem/EventAttendeeItem';
import {Suspense} from 'react';

interface Props {
  eventShortId: string;
}

export async function EventAttendees({eventShortId}: Props) {
  const attendees = await api.event.getAttendees.query({
    eventShortId: eventShortId,
  });
  const getAllEventsAttendeesPromise = api.event.getAllEventsAttendees.query({
    eventShortId: eventShortId,
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <PageHeader title="Event attendees" />
        <div className="flex gap-2">
          <MessageParticipantsButton />
          <ExportAttendeesCSV />
          <Suspense fallback={<LoadingBlock />}>
            <InviteButton
              eventShortId={eventShortId}
              getAllEventsAttendeesPromise={getAllEventsAttendeesPromise}
            />
          </Suspense>
        </div>
        {attendees?.length === 0 && (
          <div className="text-center">
            <Text>No attendees yet...</Text>
          </div>
        )}
        {attendees?.map((eventSignUp) => {
          return (
            <EventAttendeeItem
              key={eventSignUp.user.id}
              eventSignUp={eventSignUp}
            />
          );
        })}
      </div>
    </>
  );
}
