import {track} from '@amplitude/analytics-browser';
import {useRouter} from 'next/router';
import {useCallback} from 'react';

type EventType =
  | 'get_directions_button_clicked'
  | 'add_to_calendar_button_clicked'
  | 'copy_url_button_clicked'
  | 'page_viewed'
  | 'user_logged_in'
  | 'user_logged_out'
  | 'event_create_submitted'
  | 'event_update_submitted'
  | 'event_created'
  | 'event_updated'
  | 'event_deleted'
  | 'event_published'
  | 'event_unpublished'
  | 'event_sign_up_submitted'
  | 'event_message_to_organizer_submitted';

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
