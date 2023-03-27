import {differenceInSeconds, sub} from 'date-fns';

const REMINDER_PERIOD_IN_SECONDS = 60 * 60 * 3;

export function createDelay({startDate}: {startDate: Date}) {
  const now = new Date();
  const notifyTime = sub(new Date(startDate), {
    seconds: REMINDER_PERIOD_IN_SECONDS,
  });
  const delay = differenceInSeconds(notifyTime, now);

  return delay;
}
