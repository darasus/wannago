import {
  format as _format,
  isSameDay as _isSameDay,
  isPast as _isPast,
  differenceInSeconds as _differenceInSeconds,
} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import {format as timeagoFormat} from 'timeago.js';

export function formatDate(
  date: Date,
  formatString: string,
  timezone?: string | null
): string {
  try {
    const d = utcToZonedTime(
      date,
      timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    return _format(d, formatString);
  } catch (error) {
    return 'Invalid date and time';
  }
}

export function formatTimeago(date: Date, timezone?: string | null) {
  const d = utcToZonedTime(
    date,
    timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  return timeagoFormat(d, 'en_US', {
    minInterval: 60,
  });
}

export function isSameDay(
  dateLeft: Date,
  dateRight: Date,
  timezone?: string | null
) {
  const dLeft = utcToZonedTime(
    dateLeft,
    timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const dRight = utcToZonedTime(
    dateRight,
    timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  return _isSameDay(dLeft, dRight);
}

export function isPast(_date: Date, timezone?: string | null) {
  const dLeft = utcToZonedTime(
    _date,
    timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const dRight = utcToZonedTime(
    new Date(),
    timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  return _differenceInSeconds(dLeft, dRight) < 0;
}

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
