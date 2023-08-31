import {captureException} from '@sentry/nextjs';
import {env} from 'client-env';

export type EventType =
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
  | 'event_message_to_organizer_submitted'
  | 'event_message_to_attendees_submitted';

export async function track(
  eventName: EventType,
  additionalAttributes: Record<string, string | number | null | undefined>
) {
  try {
    if (env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
      await fetch(`https://api.tinybird.co/v0/events?name=${eventName}`, {
        method: 'POST',
        body: JSON.stringify(additionalAttributes),
        headers: {
          Authorization:
            'Bearer p.eyJ1IjogIjgwYmMxODdkLTg1ZGMtNGRiOC05NjUxLTc0NTM1NWQ3NDdhOSIsICJpZCI6ICIyMTQ0N2YyMi05ODNiLTRiYWEtYmNlMS0yYjg3YmY1YjgxZGIiLCAiaG9zdCI6ICJldV9zaGFyZWQifQ.lha6Tq_gcBnWZXjoktl1SDni1Sd4WNOpieuuVJA3jME',
        },
      });
    }
  } catch (error) {
    captureException(error);
  }
}
