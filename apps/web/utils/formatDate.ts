import {format} from 'date-fns';
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
