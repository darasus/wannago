import {use, useCallback} from 'react';
import {usePathname} from 'next/navigation';
import va from '@vercel/analytics';
import {api} from '../../../apps/web/src/trpc/client';

type EventType =
  | 'get_directions_button_clicked'
  | 'add_to_calendar_button_clicked'
  | 'copy_event_url_button_clicked'
  | 'get_started_button_clicked'
  | 'link_stripe_account_button_clicked'
  | 'view_stripe_account_button_clicked'
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
  | 'event_message_to_attendees_submitted'
  | 'event_message_to_organizer_submitted';

export function useTracker() {
  const pathname = usePathname();
  const me = use(api.user.me.query());

  const logEvent = useCallback(
    (
      eventType: EventType,
      options?: Record<string, string | number | null | undefined>
    ) => {
      va.track(eventType, {
        eventType,
        ...options,
        userId: me?.id || null,
        pathname: options?.pathname ?? pathname ?? null,
        eventId: options?.eventId ?? null,
      });
    },
    [pathname, me?.id]
  );

  return {logEvent};
}
