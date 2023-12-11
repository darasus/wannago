import type {ColumnType} from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type {
  Listing,
  EventVisibility,
  SignUpProtection,
  TicketSaleStatus,
  EventRegistrationStatus,
  UserType,
  Currency,
} from './enums';

export type CheckoutSession = {
  id: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  expires: Timestamp;
  userId: string;
  eventId: string;
};
export type Conversation = {
  id: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
};
export type ConversationLastSeen = {
  id: string;
  lastSeen: Timestamp;
  conversationId: string;
  userId: string | null;
  organizationId: string | null;
};
export type EmailVerificationToken = {
  id: string;
  user_id: string;
  expires: Timestamp;
};
export type Event = {
  id: string;
  shortId: string;
  title: string;
  description: string | null;
  startDate: Timestamp;
  endDate: Timestamp;
  isPublished: Generated<number>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  maxNumberOfAttendees: number;
  featuredImageSrc: string | null;
  featuredImageWidth: number | null;
  featuredImageHeight: number | null;
  featuredImagePreviewSrc: string | null;
  address: string | null;
  longitude: number | null;
  latitude: number | null;
  organizationId: string | null;
  userId: string | null;
  messageId: string | null;
  preferredCurrency: Currency;
  eventVisibility: Generated<EventVisibility>;
  signUpProtection: Generated<SignUpProtection>;
  eventVisibilityCode: string | null;
  signUpProtectionCode: string | null;
  listing: Generated<Listing>;
};
export type EventSignUp = {
  id: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  hasPlusOne: Generated<number | null>;
  status: Generated<EventRegistrationStatus>;
  eventId: string;
  userId: string;
};
export type Follow = {
  id: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
  followerUserId: string;
  followingUserId: string | null;
  followingOrganizationId: string | null;
};
export type Key = {
  id: string;
  hashed_password: string | null;
  user_id: string;
};
export type Message = {
  id: string;
  text: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
  conversationId: string;
  userId: string | null;
  organizationId: string | null;
};
export type Organization = {
  id: string;
  name: string;
  email: string;
  logoSrc: string;
  disabled: Generated<number>;
  stripeCustomerId: string | null;
  stripeLinkedAccountId: string | null;
  preferredCurrency: Generated<Currency | null>;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
};
export type OrganizationConversation = {
  A: string;
  B: string;
};
export type PasswordResetToken = {
  id: string;
  user_id: string;
  expires: Timestamp;
};
export type Session = {
  id: string;
  user_id: string;
  active_expires: number;
  idle_expires: number;
};
export type Ticket = {
  id: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  title: string;
  description: string | null;
  eventId: string;
  price: number;
  maxQuantity: number;
};
export type TicketSale = {
  id: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  quantity: number;
  ticketId: string;
  userId: string;
  eventId: string;
  eventSignUpId: string | null;
  status: Generated<TicketSaleStatus>;
  checkoutSessionId: string | null;
};
export type User = {
  id: string;
  email: string;
  email_verified: Generated<number>;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
  externalId: string | null;
  firstName: string;
  lastName: string;
  profileImageSrc: string | null;
  type: Generated<UserType>;
  disabled: Generated<number>;
  stripeCustomerId: string | null;
  stripeLinkedAccountId: string | null;
  preferredCurrency: Generated<Currency | null>;
};
export type UserConversation = {
  A: string;
  B: string;
};
export type UserOrganizations = {
  A: string;
  B: string;
};
export type DB = {
  _OrganizationConversation: OrganizationConversation;
  _UserConversation: UserConversation;
  _UserOrganizations: UserOrganizations;
  CheckoutSession: CheckoutSession;
  Conversation: Conversation;
  ConversationLastSeen: ConversationLastSeen;
  EmailVerificationToken: EmailVerificationToken;
  Event: Event;
  EventSignUp: EventSignUp;
  Follow: Follow;
  Key: Key;
  Message: Message;
  Organization: Organization;
  PasswordResetToken: PasswordResetToken;
  Session: Session;
  Ticket: Ticket;
  TicketSale: TicketSale;
  User: User;
};
