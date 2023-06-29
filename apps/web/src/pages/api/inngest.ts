import {serve} from 'inngest/next';
import {
  eventCreated,
  eventPublished,
  eventRemoved,
  eventUnpublished,
  eventUpdated,
  inngest,
  stripePayoutScheduled,
  emailReminderScheduled,
  emailReminderSent,
  stripeTicketsPurchased,
  ticketPurchaseEmailSent,
  userAccountRegistered,
} from 'inngest-client';

export default serve(inngest, [
  eventCreated,
  eventUpdated,
  eventPublished,
  eventUnpublished,
  eventRemoved,
  stripePayoutScheduled,
  emailReminderScheduled,
  emailReminderSent,
  stripeTicketsPurchased,
  ticketPurchaseEmailSent,
  userAccountRegistered,
]);