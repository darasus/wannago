import {EventRegistrationStatus} from '@prisma/client';
import {Badge} from '../Badge/Badge';

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
    <Badge
      color={statusBadgeMap[status].color}
      data-testid="sign-up-status-badge"
    >
      {statusBadgeMap[status].label}
    </Badge>
  );
}
