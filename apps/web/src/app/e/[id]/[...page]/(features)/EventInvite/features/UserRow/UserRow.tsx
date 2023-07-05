import {EventRegistrationStatus, User} from '@prisma/client';
import {CardBase, Text} from 'ui';
import {EventRegistrationStatusBadge} from 'ui';
import {InviteButton} from '../InviteButton/InviteButton';

interface UserRowProps {
  user: User & {status: EventRegistrationStatus | null};
  eventShortId: string;
}

export function UserRow({user, eventShortId}: UserRowProps) {
  return (
    <>
      <CardBase
        key={user.id}
        innerClassName="flex flex-col md:flex-row gap-2"
        data-testid="invitee-card"
      >
        <div className="flex items-center truncate grow">
          <Text className="truncate">{`${user.firstName} ${user.lastName} · ${user.email}`}</Text>
        </div>
        <div className="flex items-center gap-2">
          {user.status && <EventRegistrationStatusBadge status={user.status} />}
          <InviteButton
            user={user}
            eventShortId={eventShortId}
            disabled={user.status !== null}
          />
        </div>
      </CardBase>
    </>
  );
}
