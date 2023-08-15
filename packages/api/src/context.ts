import {Currency} from '@prisma/client';
import {prisma} from 'database';
import {Postmark} from 'lib/src/postmark';
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
import {canModifyEvent} from './actions/canModifyEvent';
import {getOrganizerByEmail} from './actions/getOrganizerByEmail';
import {assertCanPurchaseTickets} from './assertions/assertCanPurchaseTickets';
import {Inngest, EventSchemas} from 'inngest';
import {EventsStoreType} from 'inngest-client';
import {NextRequest} from 'next/server';
import {NextApiRequest} from 'next';
import {getPageSession, auth as _auth} from 'auth';
import {cookies} from 'next/headers';
import {AuthRequest} from 'lucia';

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
  auth: Awaited<ReturnType<typeof getPageSession> | null>;
  authRequest: AuthRequest | null;
  prisma: typeof prisma;
  timezone: string | undefined;
  currency: Currency;
  postmark: Postmark;
  cache: CacheService;
  inngest: InngestType;
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
    postmark: _opts.postmark,
    cache: _opts.cache,
    inngest: _opts.inngest,
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

export async function createContext(opts: {
  req: NextRequest | NextApiRequest;
}): Promise<Context> {
  let timezone: string | undefined = undefined;
  let country: string | undefined = undefined;

  if (typeof opts.req.headers.get === 'function') {
    timezone = opts.req.headers.get('x-vercel-ip-timezone') ?? 'UTC';
  }

  if ('x-vercel-ip-timezone' in opts.req.headers) {
    timezone = opts.req.headers['x-vercel-ip-timezone'] as string;
  }

  if (typeof opts.req.headers.get === 'function') {
    country = opts.req.headers.get('x-vercel-ip-country') ?? 'UTC';
  }

  if ('x-vercel-ip-timezone' in opts.req.headers) {
    country = opts.req.headers['x-vercel-ip-country'] as string;
  }

  const currency = getCurrencyFromHeaders(country);
  const auth = await getPageSession();

  let authRequest: any = null;

  if (opts.req instanceof NextRequest) {
    authRequest = _auth.handleRequest({
      request: opts.req,
      cookies,
    });
  }

  const innerContext = createContextInner({
    auth,
    authRequest,
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
