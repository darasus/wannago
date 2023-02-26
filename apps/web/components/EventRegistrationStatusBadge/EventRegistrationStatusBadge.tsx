import {EventRegistrationStatus} from '@prisma/client';
import {Badge} from 'ui';

interface Props {
  status: EventRegistrationStatus;
}

const statusBadgeMap: Record<
  EventRegistrationStatus,
  {label: string; color: 'green' | 'red' | 'yellow'}
> = {
  [EventRegistrationStatus.REGISTERED]: {label: 'Signed up', color: 'green'},
  [EventRegistrationStatus.CANCELLED]: {label: 'Cancelled', color: 'red'},
  [EventRegistrationStatus.INVITED]: {label: 'Invited', color: 'yellow'},
};

export function EventRegistrationStatusBadge({status}: Props) {
  return (
    <Badge size="sm" color={statusBadgeMap[status].color} className="mr-4">
      {statusBadgeMap[status].label}
    </Badge>
  );
}
