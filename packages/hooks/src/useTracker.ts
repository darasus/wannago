import {useCallback} from 'react';
import {TinyBird, EventType} from 'lib/src/TinyBird';
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
  const {track} = new TinyBird({user: me});

  const logEvent = useCallback(
    (eventType: EventType, options?: Options) => {
      track(eventType, {
        eventType,
        ...options?.extra,
        pathname: options?.pathname ?? pathname,
        eventId: options?.eventId,
      });
    },
    [pathname, track]
  );

  return {logEvent};
}
