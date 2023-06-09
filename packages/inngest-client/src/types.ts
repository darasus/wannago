import {Stripe} from 'lib';
import {PrismaClient} from '@prisma/client';

export interface ActionParams {
  ctx: ActionContext;
}

export interface ActionContext {
  stripe: Stripe['client'];
  prisma: PrismaClient;
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
};
