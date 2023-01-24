import {formatTimeago, isPast} from './formatDate';

export function getRelativeTime(
  startDate: Date,
  endDate: Date,
  timezone?: string
) {
  if (isPast(endDate, timezone)) {
    return `Ended ${formatTimeago(new Date(endDate), timezone)}`;
  }

  if (isPast(startDate, timezone)) {
    return `Started ${formatTimeago(new Date(startDate), timezone)}`;
  }

  return `${formatTimeago(new Date(startDate), timezone)}`;
}
