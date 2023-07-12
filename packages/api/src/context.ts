import {
  clerkClient as clerk,
  getAuth,
  createClerkClient,
} from '@clerk/nextjs/server';
import {Currency, PrismaClient} from '@prisma/client';
import {db, prisma} from 'database';
import {Postmark} from 'lib/src/postmark';
import {CacheService} from 'lib/src/cache';
import {SignedInAuthObject, SignedOutAuthObject} from '@clerk/clerk-sdk-node';
import {getCurrencyFromHeaders} from 'utils';
import {getEvents} from './actions/getEvents';
import {getUserByExternalId} from './actions/getUserByExternalId';
import {getUserById} from './actions/getUserById';
import {getOrganizationById} from './actions/getOrganizationById';
import {getEvent} from './actions/getEvent';
import {getOrganizerByEventId} from './actions/getOrganizerByEventId';
import {getOrganizationByUserId} from './actions/getOrganizationByUserId';
import {getOrganizationByUserExternalId} from './actions/getOrganizationByUserExternalId';
import {getUserByEmail} from './actions/getUserByEmail';
import {getOrganizationWithMembersByOrganizationId} from './actions/getOrganizationWithMembersByOrganizationId';
import {canModifyEvent} from './actions/canModifyEvent';
import {getOrganizerByEmail} from './actions/getOrganizerByEmail';
import {assertCanPurchaseTickets} from './assertions/assertCanPurchaseTickets';
import {Inngest, EventSchemas} from 'inngest';
import {EventsStoreType} from 'inngest-client';
import type {NextRequest} from 'next/server';
import {NextApiRequest} from 'next';

const actions = {
  getEvents,
  getUserByExternalId,
  getUserById,
  getOrganizationById,
  getEvent,
  getOrganizerByEventId,
  getOrganizationByUserId,
  getOrganizationByUserExternalId,
  getUserByEmail,
  getOrganizationWithMembersByOrganizationId,
  canModifyEvent,
  getOrganizerByEmail,
} as const;

const assertions = {
  assertCanPurchaseTickets,
} as const;

type Actions = {
  [K in keyof typeof actions]: ReturnType<(typeof actions)[K]>;
};

type Assertions = {
  [K in keyof typeof assertions]: ReturnType<(typeof assertions)[K]>;
};

interface CreateInnerContextOptions {
  auth: SignedInAuthObject | SignedOutAuthObject | null;
  clerk: ReturnType<typeof createClerkClient>;
  prisma: PrismaClient;
  timezone: string;
  currency: Currency;
  postmark: Postmark;
  cache: CacheService;
  inngest: InngestType;
  db: typeof db;
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
    clerk: _opts.clerk,
    prisma: _opts.prisma,
    timezone: _opts.timezone,
    currency: _opts.currency,
    postmark: _opts.postmark,
    cache: _opts.cache,
    inngest: _opts.inngest,
    db: _opts.db,
  };
}

export type ActionContext = CreateInnerContextOptions;
export type AssertionContext = CreateInnerContextOptions;
export type Context = CreateContextOptions;

const inngest = new Inngest({
  name: 'WannaGo',
  schemas: new EventSchemas().fromRecord<EventsStoreType>(),
});
export type InngestType = typeof inngest;

export function createContext(opts: {req: NextRequest}): Context {
  const timezone = opts.req.headers.get('x-vercel-ip-timezone') ?? 'UTC';
  const currency = getCurrencyFromHeaders(
    opts.req.headers.get('x-vercel-ip-country')
  );
  const auth = getAuth(opts.req);

  const innerContext = createContextInner({
    db,
    auth,
    clerk,
    prisma,
    timezone,
    currency,
    inngest,
    postmark: new Postmark(),
    cache: new CacheService(),
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

export function createNodeContext(opts: {req: NextApiRequest}): Context {
  const timezone =
    (opts.req.headers['x-vercel-ip-timezone'] as string) ?? 'UTC';
  const currency = getCurrencyFromHeaders(
    opts.req.headers['x-vercel-ip-country'] as string | undefined
  );
  const auth = getAuth(opts.req);

  const innerContext = createContextInner({
    db,
    auth,
    clerk,
    prisma,
    timezone,
    currency,
    inngest,
    postmark: new Postmark(),
    cache: new CacheService(),
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
