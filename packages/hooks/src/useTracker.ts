import {useCallback} from 'react';
import {track, EventType} from 'lib/src/TinyBird';
import {usePathname} from 'next/navigation';
import {useMe} from './useMe';

interface Options {
  pathname?: string;
  eventId?: string;
  extra?: Record<string, unknown>;
}

export function useTracker() {
  const pathname = usePathname();
  const me = useMe();

  const logEvent = useCallback(
    (eventType: EventType, options?: Options) => {
      return track(eventType, {
        userId: me?.id,
        eventType,
        ...options?.extra,
        pathname: options?.pathname ?? pathname,
        eventId: options?.eventId,
      });
    },
    [pathname, me?.id]
  );

  return {logEvent};
}
