import {Stripe} from 'lib/src/stripe';
import {prisma} from 'database';

export interface ActionParams {
  ctx: ActionContext;
}

export interface ActionContext {
  stripe: Stripe['client'];
  prisma: typeof prisma;
}

export type Currency = 'usd' | 'eur' | 'gbp';

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
  'stripe/payout.scheduled': {
    data: {
      eventId: string;
    };
  };
  'email/reminder.scheduled': {
    data: {
      eventId: string;
    };
  };
  'email/reminder.sent': {
    data: {
      eventId: string;
      userId: string;
    };
  };
  'email/event.sign.up': {
    data: {
      eventId: string;
      userId: string;
    };
  };
  'email/event.invite': {
    data: {
      eventId: string;
      userId: string;
    };
  };
  'email/message.to.all.attendees': {
    data: {
      eventId: string;
      organizerId: string;
      message: string;
      subject: string;
    };
  };
  'email/after.register.no.created.event.follow.up.email': {
    data: {
      userId: string;
    };
  };
  'email/event.cancel.invite': {
    data: {
      userId: string;
      eventId: string;
    };
  };
  'email/event.cancel.sign.up': {
    data: {
      userId: string;
      eventId: string;
    };
  };
  'email/organizer.event.sign.up.notification': {
    data: {
      userId: string;
      eventId: string;
    };
  };
  'stripe/tickets.purchased': {
    data: {
      eventId: string;
      userId: string;
      ticketSaleIds: string[];
    };
  };
  'email/ticket-purchase-email.sent': {
    data: {
      eventId: string;
      userId: string;
      ticketSaleIds: string[];
    };
  };
  'user/account.registered': {
    data: {
      userId: string;
    };
  };
};
