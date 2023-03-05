import {useRouter} from 'next/router';

export function useEventId() {
  const router = useRouter();
  const eventId = router.query.id;

  if (typeof eventId === 'undefined') {
    throw new Error(
      'useEventId must be used with routes with event id segment'
    );
  }

  if (typeof eventId === 'string') {
    return eventId;
  }

  return eventId.join();
}
