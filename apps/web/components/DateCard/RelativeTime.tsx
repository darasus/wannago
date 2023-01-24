import {Event} from '@prisma/client';
import {useMemo} from 'react';
import {formatTimeago, isPast} from '../../utils/formatDate';

interface Props {
  startDate: Date;
  endDate: Date;
  timezone?: string;
}

export default function RelativeTime({startDate, endDate, timezone}: Props) {
  const relativeTime = useMemo(
    () => getRelativeTime(startDate, endDate, timezone),
    [startDate, endDate, timezone]
  );

  return <>{relativeTime}</>;
}

function getRelativeTime(startDate: Date, endDate: Date, timezone?: string) {
  if (isPast(endDate, timezone)) {
    return `Ended ${formatTimeago(new Date(endDate), timezone)}`;
  }

  if (isPast(startDate, timezone)) {
    return `Started ${formatTimeago(new Date(startDate), timezone)}`;
  }

  return `${formatTimeago(new Date(startDate), timezone)}`;
}
