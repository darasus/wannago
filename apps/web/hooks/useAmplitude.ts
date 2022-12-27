import {track} from '@amplitude/analytics-browser';
import {useRouter} from 'next/router';
import {useCallback} from 'react';

type EventType =
  | 'button_clicked'
  | 'page_viewed'
  | 'user_logged_in'
  | 'user_logged_out'
  | 'event_create_submitted'
  | 'event_update_submitted'
  | 'event_created'
  | 'event_updated';

interface Options {
  pathname?: string;
  eventId?: string;
}

export function useAmplitude() {
  const router = useRouter();

  const logEvent = useCallback(
    (eventType: EventType, options?: Options) => {
      track({
        event_type: eventType,
        event_properties: {
          pathname: options?.pathname ?? router.pathname,
          event_id: options?.eventId,
        },
      });
    },
    [router.pathname]
  );

  return {logEvent};
}
