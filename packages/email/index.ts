import EventInvite from './emails/EventInvite';
import EventCancelInvite from './emails/EventCancelInvite';
import EventSignUp from './emails/EventSignUp';
import EventCancelSignUp from './emails/EventCancelSignUp';
import EventReminder from './emails/EventReminder';
import MessageToAttendees from './emails/MessageToAttendees';
import MessageToOrganizer from './emails/MessageToOrganizer';
import LoginCode from './emails/LoginCode';
import OrganizerEventSignUpNotification from './emails/OrganizerEventSignUpNotification';
import TicketPurchaseSuccess from './emails/TicketPurchaseSuccess';
import VerifyEmail from './emails/VerifyEmail';
import {render} from '@react-email/render';

export {
  render,
  EventInvite,
  EventSignUp,
  EventReminder,
  MessageToAttendees,
  MessageToOrganizer,
  LoginCode,
  EventCancelInvite,
  EventCancelSignUp,
  OrganizerEventSignUpNotification,
  TicketPurchaseSuccess,
  VerifyEmail,
};
