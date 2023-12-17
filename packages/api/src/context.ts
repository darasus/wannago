import {Currency} from '@prisma/client';
import {prisma} from 'database';
import {resend} from 'lib/src/Resend';
import {CacheService} from 'lib/src/cache';
import {getCurrencyFromHeaders} from 'utils';
import {getEvents} from './actions/getEvents';
import {getUserById} from './actions/getUserById';
import {getOrganizationById} from './actions/getOrganizationById';
import {getEvent} from './actions/getEvent';
import {getOrganizerByEventId} from './actions/getOrganizerByEventId';
import {getOrganizationByUserId} from './actions/getOrganizationByUserId';
import {getOrganizationByUserExternalId} from './actions/getOrganizationByUserExternalId';
import {getUserByEmail} from './actions/getUserByEmail';
import {getOrganizationWithMembersByOrganizationId} from './actions/getOrganizationWithMembersByOrganizationId';
import {assertCanModifyEvent} from './assertions/assertCanModifyEvent';
import {getOrganizerByEmail} from './actions/getOrganizerByEmail';
import {assertCanPurchaseTickets} from './assertions/assertCanPurchaseTickets';
import {assertCanJoinEvent} from './assertions/assertCanJoinEvent';
import {assertCanViewEvent} from './assertions/assertCanViewEvent';
import {assertCanPublishEvent} from './assertions/assertCanPublishEvent';
import {Inngest, EventSchemas, slugify} from 'inngest';
import {EventsStoreType} from 'inngest-client';
import {getPageSession, auth as _auth} from 'auth';
import {cookies, headers} from 'next/headers';
import {AuthRequest} from 'lucia';
import {getOrganizerById} from './actions/getOrganizerById';
import {createStripeClient, stripe} from 'lib/src/stripe';
import {createPaymentIntent} from './actions/createPaymentIntent';

const actions = {
  getEvents,
  getUserById,
  getOrganizationById,
  getEvent,
  getOrganizerByEventId,
  getOrganizationByUserId,
  getOrganizationByUserExternalId,
  getUserByEmail,
  getOrganizationWithMembersByOrganizationId,
  getOrganizerByEmail,
  getOrganizerById,
  createPaymentIntent,
} as const;

const assertions = {
  assertCanPurchaseTickets,
  assertCanJoinEvent,
  assertCanViewEvent,
  assertCanPublishEvent,
  assertCanModifyEvent,
} as const;

type Actions = {
  [K in keyof typeof actions]: ReturnType<(typeof actions)[K]>;
};

type Assertions = {
  [K in keyof typeof assertions]: ReturnType<(typeof assertions)[K]>;
};

interface CreateInnerContextOptions {
  auth: Awaited<ReturnType<typeof getPageSession> | null>;
  authRequest: AuthRequest | null;
  prisma: typeof prisma;
  timezone: string | undefined;
  currency: Currency;
  cache: CacheService;
  inngest: InngestType;
  stripe: typeof stripe;
  createStripeClient: typeof createStripeClient;
  resend: typeof resend;
}

interface CreateContextOptions extends CreateInnerContextOptions {
  actions: Actions;
  assertions: Assertions;
}

export function createContextInner(
  _opts: CreateInnerContextOptions
): CreateInnerContextOptions {
  return {
    auth: _opts.auth,
    authRequest: _opts.authRequest,
    prisma: _opts.prisma,
    timezone: _opts.timezone,
    currency: _opts.currency,
    cache: _opts.cache,
    inngest: _opts.inngest,
    stripe: _opts.stripe,
    createStripeClient: _opts.createStripeClient,
    resend: _opts.resend,
  };
}

export type ActionContext = CreateInnerContextOptions;
export type AssertionContext = CreateInnerContextOptions;
export type Context = CreateContextOptions;

const inngest = new Inngest({
  id: slugify('WannaGo'),
  schemas: new EventSchemas().fromRecord<EventsStoreType>(),
});
export type InngestType = typeof inngest;

export async function createContext(): Promise<Context> {
  const _headers = headers();
  const timezone = _headers.get('x-vercel-ip-timezone') ?? 'UTC';
  const country = _headers.get('x-vercel-ip-country') ?? 'UTC';
  const currency = getCurrencyFromHeaders(country);
  const auth = await getPageSession();
  const innerContext = createContextInner({
    auth,
    authRequest: _auth.handleRequest('GET', {
      headers,
      cookies,
    }),
    prisma,
    timezone,
    currency,
    inngest,
    cache: new CacheService(),
    stripe,
    createStripeClient,
    resend,
  });

  return Object.assign(innerContext, {
    actions: Object.values(actions).reduce<Actions>((acc, action) => {
      return {...acc, [action.name]: action(innerContext)};
    }, {} as Actions),
    assertions: Object.values(assertions).reduce<Assertions>(
      (acc, assertion) => {
        return {...acc, [assertion.name]: assertion(innerContext)};
      },
      {} as Assertions
    ),
  });
}
