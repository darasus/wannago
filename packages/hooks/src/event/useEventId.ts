import {useRouter} from 'next/router';

export const useEventId = (): {eventShortId: string | null} => {
  const router = useRouter();
  const eventId = router.query.id;

  if (typeof eventId === 'undefined') {
    return {
      eventShortId: null,
    };
  }

  if (typeof eventId === 'string') {
    return {eventShortId: eventId};
  }

  return {eventShortId: eventId.join()};
};
