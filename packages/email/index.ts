import EventInvite from './emails/EventInvite';
import EventCancelInvite from './emails/EventCancelInvite';
import EventSignUp from './emails/EventSignUp';
import EventCancelSignUp from './emails/EventCancelSignUp';
import EventReminder from './emails/EventReminder';
import MessageToAttendees from './emails/MessageToAttendees';
import LoginCode from './emails/LoginCode';
import AfterRegisterNoCreatedEventFollowUpEmail from './emails/AfterRegisterNoCreatedEventFollowUpEmail';
import OrganizerEventSignUpNotification from './emails/OrganizerEventSignUpNotification';
import TicketPurchaseSuccess from './emails/TicketPurchaseSuccess';
import {render} from '@react-email/render';

export {
  render,
  EventInvite,
  EventSignUp,
  EventReminder,
  MessageToAttendees,
  LoginCode,
  AfterRegisterNoCreatedEventFollowUpEmail,
  EventCancelInvite,
  EventCancelSignUp,
  OrganizerEventSignUpNotification,
  TicketPurchaseSuccess,
};
