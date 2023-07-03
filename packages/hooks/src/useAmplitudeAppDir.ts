import {track} from '@amplitude/analytics-browser';
import {usePathname} from 'next/navigation';
import {useCallback} from 'react';

type EventType =
  | 'get_directions_button_clicked'
  | 'add_to_calendar_button_clicked'
  | 'copy_event_url_button_clicked'
  | 'get_started_button_clicked'
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
  | 'event_sign_up_cancel_submitted'
  | 'event_message_to_organizer_submitted'
  | 'event_message_to_attendees_submitted';

interface Options {
  pathname?: string;
  eventId?: string;
}

export function useAmplitudeAppDir() {
  const pathname = usePathname();

  const logEvent = useCallback(
    (eventType: EventType, options?: Options) => {
      track({
        event_type: eventType,
        event_properties: {
          pathname: options?.pathname ?? pathname,
          event_id: options?.eventId,
        },
      });
    },
    [pathname]
  );

  return {logEvent};
}
