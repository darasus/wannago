import {format, isSameDay as _isSameDay} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import {format as timeagoFormat} from 'timeago.js';

export function formatDate(
  date: Date,
  formatString: string,
  timezone?: string | null
): string {
  const d = utcToZonedTime(
    date,
    timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  return format(d, formatString);
}

export function formatTimeago(date: Date, timezone?: string | null) {
  const d = utcToZonedTime(
    date,
    timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  return timeagoFormat(d, 'en_US');
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
