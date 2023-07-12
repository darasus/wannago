export const EventRegistrationStatus = {
  REGISTERED: 'REGISTERED',
  CANCELLED: 'CANCELLED',
  INVITED: 'INVITED',
} as const;
export type EventRegistrationStatus =
  (typeof EventRegistrationStatus)[keyof typeof EventRegistrationStatus];
export const UserType = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;
export type UserType = (typeof UserType)[keyof typeof UserType];
export const Currency = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
} as const;
export type Currency = (typeof Currency)[keyof typeof Currency];
