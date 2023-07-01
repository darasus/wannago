import {PageHeader, Text} from 'ui';
import {EventInviteButton} from './features/EventInviteButton/EventInviteButton';
import {UserRow} from './features/UserRow/UserRow';
import {RouterOutputs} from 'api';

interface Props {
  eventShortId: string;
  allAttendees: RouterOutputs['event']['getAllEventsAttendees'];
}

export function EventInvite({allAttendees, eventShortId}: Props) {
  return (
    <>
      <div className="flex flex-col gap-y-4">
        <PageHeader title="Invite attendees" />
        <div>
          <EventInviteButton />
        </div>
        {allAttendees?.length === 0 && (
          <div className="text-center">
            <Text>{`You don't have users to invite yet...`}</Text>
          </div>
        )}
        {allAttendees?.map((user) => {
          return (
            <UserRow key={user.id} user={user} eventShortId={eventShortId} />
          );
        })}
      </div>
    </>
  );
}
