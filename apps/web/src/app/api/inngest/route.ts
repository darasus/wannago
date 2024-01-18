import {serve} from 'inngest/next';
import {
  eventCreated,
  eventPublished,
  eventRemoved,
  eventUnpublished,
  eventUpdated,
  inngest,
  emailReminderScheduled,
  emailReminderSent,
  stripeTicketsPurchased,
  ticketPurchaseEmailSent,
  userAccountRegistered,
  eventCancelInvite,
  eventCancelSignUp,
  eventInvite,
  eventSignUp,
  messageToAllAttendees,
  organizerEventSignUpNotification,
  verifyEmailAddressEmail,
  messageOrganizer,
} from 'inngest-client';

export const {GET, POST, PUT} = serve({
  client: inngest,
  functions: [
    eventCreated,
    eventUpdated,
    eventPublished,
    eventUnpublished,
    eventRemoved,
    emailReminderScheduled,
    emailReminderSent,
    stripeTicketsPurchased,
    ticketPurchaseEmailSent,
    userAccountRegistered,
    eventCancelInvite,
    eventCancelSignUp,
    eventInvite,
    eventSignUp,
    messageToAllAttendees,
    organizerEventSignUpNotification,
    verifyEmailAddressEmail,
    messageOrganizer,
  ],
});
