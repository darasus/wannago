import {differenceInSeconds, sub} from 'date-fns';
import {REMINDER_PERIOD_IN_SECONDS} from 'const';

export function createDelay({startDate}: {startDate: Date}) {
  const now = new Date();
  const notifyTime = sub(new Date(startDate), {
    seconds: REMINDER_PERIOD_IN_SECONDS,
  });
  const delay = differenceInSeconds(notifyTime, now);

  return delay;
}
