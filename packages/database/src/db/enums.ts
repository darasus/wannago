export const Listing = {
  LISTED: 'LISTED',
  UNLISTED: 'UNLISTED',
} as const;
export type Listing = (typeof Listing)[keyof typeof Listing];
export const EventVisibility = {
  PUBLIC: 'PUBLIC',
  PROTECTED: 'PROTECTED',
} as const;
export type EventVisibility =
  (typeof EventVisibility)[keyof typeof EventVisibility];
export const SignUpProtection = {
  PUBLIC: 'PUBLIC',
  PROTECTED: 'PROTECTED',
} as const;
export type SignUpProtection =
  (typeof SignUpProtection)[keyof typeof SignUpProtection];
export const TicketSaleStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
} as const;
export type TicketSaleStatus =
  (typeof TicketSaleStatus)[keyof typeof TicketSaleStatus];
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
