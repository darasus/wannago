import {useRouter} from 'next/router';

export function useEventId() {
  const router = useRouter();
  const eventId = router.query.id;

  if (typeof eventId === 'undefined') {
    return null;
  }

  if (typeof eventId === 'string') {
    return eventId;
  }

  return eventId.join();
}
