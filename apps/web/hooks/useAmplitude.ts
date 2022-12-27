import {track} from '@amplitude/analytics-browser';
import {useRouter} from 'next/router';
import {useCallback} from 'react';

type EventType =
  | 'button_clicked'
  | 'page_viewed'
  | 'user_logged_in'
  | 'user_logged_out';

interface Options {
  pathname?: string;
}

export function useAmplitude() {
  const router = useRouter();

  const logEvent = useCallback(
    (eventType: EventType, options?: Options) => {
      track({
        event_type: eventType,
        event_properties: {
          pathname: options?.pathname ?? router.pathname,
        },
      });
    },
    [router.pathname]
  );

  return {logEvent};
}
