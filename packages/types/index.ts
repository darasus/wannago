export enum EmailType {
  EventSignUp = 'EventSignUp',
  EventCancelSignUp = 'EventCancelSignUp',
  EventInvite = 'EventInvite',
  EventCancelInvite = 'EventCancelInvite',
  EventReminder = 'EventReminder',
  MessageToOrganizer = 'MessageToOrganizer',
  MessageToAllAttendees = 'MessageToAllAttendees',
  AfterRegisterNoCreatedEventFollowUpEmail = 'AfterRegisterNoCreatedEventFollowUpEmail',
  OrganizerEventSignUpNotification = 'OrganizerEventSignUpNotification',
}

export type PricingPlan = 'starter' | 'pro';

export type EventsStoreType = {
  'event.created': {
    data: {
      eventId: string;
    };
  };
  'event.updated': {
    data: {
      eventId: string;
    };
  };
  'event.published': {
    data: {
      eventId: string;
    };
  };
  'event.unpublished': {
    data: {
      eventId: string;
    };
  };
  'event.removed': {
    data: {
      eventId: string;
    };
  };
};
