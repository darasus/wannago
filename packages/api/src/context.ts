import {
  clerkClient as clerk,
  getAuth,
  createClerkClient,
} from '@clerk/nextjs/server';
import {Currency, PrismaClient} from '@prisma/client';
import {prisma} from 'database';
import {Postmark} from 'lib/src/postmark';
import {MailQueue} from 'lib/src/mailQueue';
import {CacheService} from 'lib/src/cache';
import {Stripe} from 'lib/src/stripe';
import {Client as GoogleMapsClient} from '@googlemaps/google-maps-services-js';
import {SignedInAuthObject, SignedOutAuthObject} from '@clerk/clerk-sdk-node';
import {getCurrencyFromHeaders} from 'utils';
import {getEvents} from 'trpc/src/actions/getEvents';
import {getUserByExternalId} from 'trpc/src/actions/getUserByExternalId';
import {getUserById} from 'trpc/src/actions/getUserById';
import {getOrganizationById} from 'trpc/src/actions/getOrganizationById';
import {getEvent} from 'trpc/src/actions/getEvent';
import {getOrganizerByEventId} from 'trpc/src/actions/getOrganizerByEventId';
import {getOrganizationByUserId} from 'trpc/src/actions/getOrganizationByUserId';
import {getOrganizationByUserExternalId} from 'trpc/src/actions/getOrganizationByUserExternalId';
import {getUserByEmail} from 'trpc/src/actions/getUserByEmail';
import {getOrganizationWithMembersByOrganizationId} from 'trpc/src/actions/getOrganizationWithMembersByOrganizationId';
import {canModifyEvent} from 'trpc/src/actions/canModifyEvent';
import {getOrganizerByEmail} from 'trpc/src/actions/getOrganizerByEmail';
import {generateEventFromPrompt} from 'trpc/src/actions/generateEventFromPrompt';
import {generateImageFromPrompt} from 'trpc/src/actions/generateImageFromPrompt';
import {assertCanCreateEvent} from 'trpc/src/assertions/assertCanCreateEvent';
import {assertCanJoinEvent} from 'trpc/src/assertions/assertCanJoinEvent';
import {assertCanPurchaseTickets} from 'trpc/src/assertions/assertCanPurchaseTickets';
import {assertCanAddOrganizationMember} from 'trpc/src/assertions/assertCanAddOrganizationMember';
import {Inngest, EventSchemas} from 'inngest';
import {EventsStoreType} from 'inngest-client';
import {NextRequest} from 'next/server';

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
  generateEventFromPrompt,
  generateImageFromPrompt,
} as const;

const assertions = {
  assertCanCreateEvent,
  assertCanJoinEvent,
  assertCanAddOrganizationMember,
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
  mailQueue: MailQueue;
  googleMaps: GoogleMapsClient;
  cache: CacheService;
  stripe: Stripe;
  inngest: InngestType;
}

interface CreateContextOptions extends CreateInnerContextOptions {
  actions: Actions;
  assertions: Assertions;
}

export async function createContextInner(_opts: CreateInnerContextOptions) {
  return {
    auth: _opts.auth,
    clerk: _opts.clerk,
    prisma: _opts.prisma,
    timezone: _opts.timezone,
    currency: _opts.currency,
    postmark: _opts.postmark,
    mailQueue: _opts.mailQueue,
    googleMaps: _opts.googleMaps,
    cache: _opts.cache,
    stripe: _opts.stripe,
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

export async function createContext(opts?: {
  req: NextRequest;
}): Promise<Context> {
  const timezone = opts?.req.headers.get('x-vercel-ip-timezone') ?? 'UTC';
  // TODO: get currency
  const currency = getCurrencyFromHeaders(undefined);

  let auth = null;

  if (opts?.req) {
    auth = getAuth(opts?.req);
  }

  const innerContext: CreateInnerContextOptions = await createContextInner({
    auth,
    clerk,
    prisma,
    timezone,
    currency,
    inngest,
    postmark: new Postmark(),
    mailQueue: new MailQueue(),
    googleMaps: new GoogleMapsClient(),
    cache: new CacheService(),
    stripe: new Stripe(),
  });

  return {
    ...innerContext,
    actions: Object.values(actions).reduce<Actions>((acc, action) => {
      return {...acc, [action.name]: action(innerContext)};
    }, {} as Actions),
    assertions: Object.values(assertions).reduce<Assertions>(
      (acc, assertion) => {
        return {...acc, [assertion.name]: assertion(innerContext)};
      },
      {} as Assertions
    ),
  };
}
