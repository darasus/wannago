import {differenceInSeconds} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import {REMINDER_PERIOD_IN_SECONDS} from 'const';

/**
 * Function returns true if the event start date is more than `REMINDER_PERIOD_IN_SECONDS` seconds away
 */
export function canCreateReminder(startDate: Date, timezone: string) {
  const selectedDate = utcToZonedTime(startDate, timezone);
  const now = utcToZonedTime(new Date(), timezone);
  const secondsToStart = differenceInSeconds(selectedDate, now);
  const isWithinReminderPeriod =
    Math.sign(secondsToStart) !== -1 &&
    secondsToStart > REMINDER_PERIOD_IN_SECONDS;

  return isWithinReminderPeriod;
}
