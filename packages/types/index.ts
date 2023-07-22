export enum EmailType {
  EventSignUp = 'EventSignUp',
  EventCancelSignUp = 'EventCancelSignUp',
  EventInvite = 'EventInvite',
  EventCancelInvite = 'EventCancelInvite',
  EventReminder = 'EventReminder',
  MessageToAllAttendees = 'MessageToAllAttendees',
  AfterRegisterNoCreatedEventFollowUpEmail = 'AfterRegisterNoCreatedEventFollowUpEmail',
  OrganizerEventSignUpNotification = 'OrganizerEventSignUpNotification',
}

export type PricingPlan = 'starter' | 'pro';
