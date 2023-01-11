import {useRouter} from 'next/router';

export function useEventId() {
  const router = useRouter();
  const eventId = router.query.id;

  if (typeof eventId === 'undefined') {
    throw new Error('useEventId must be used within an Event page');
  }

  if (typeof eventId === 'string') {
    return eventId;
  }

  return eventId.join();
}
