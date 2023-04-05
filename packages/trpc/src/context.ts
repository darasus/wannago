import {
  clerkClient as clerk,
  getAuth,
  createClerkClient,
} from '@clerk/nextjs/server';
import {PrismaClient} from '@prisma/client';
import {prisma} from 'database';
import {Telegram} from 'lib/src/telegram';
import {Postmark} from 'lib/src/postmark';
import {MailQueue} from 'lib/src/mailQueue';
import {CacheService} from 'lib/src/cache';
import {Stripe} from 'lib/src/stripe';
import {type CreateNextContextOptions} from '@trpc/server/adapters/next';
import {Client as GoogleMapsClient} from '@googlemaps/google-maps-services-js';
import {SignedInAuthObject, SignedOutAuthObject} from '@clerk/clerk-sdk-node';
// actions
import {getEvents} from './actions/getEvents';
import {getUserByExternalId} from './actions/getUserByExternalId';
import {getUserById} from './actions/getUserById';
import {getOrganizationById} from './actions/getOrganizationById';
import {getOrganizationByExternalId} from './actions/getOrganizationByExternalId';
import {getEvent} from './actions/getEvent';
import {getOrganizerByEventId} from './actions/getOrganizerByEventId';
import {getOrganizationByUserId} from './actions/getOrganizationByUserId';
import {getOrganizationByUserExternalId} from './actions/getOrganizationByUserExternalId';
import {getUserByEmail} from './actions/getUserByEmail';
import {getOrganizationWithMembersByOrganizationId} from './actions/getOrganizationWithMembersByOrganizationId';
import {canModifyEvent} from './actions/canModifyEvent';
import {updateEventReminder} from './actions/updateEventReminder';
import {createEventReminder} from './actions/createEventReminder';
import {getOrganizerByEmail} from './actions/getOrganizerByEmail';
// assertions
import {assertCanCreateEvent} from './assertions/assertCanCreateEvent';
import {assertCanJoinEvent} from './assertions/assertCanJoinEvent';

const actions = {
  getEvents,
  getUserByExternalId,
  getUserById,
  getOrganizationById,
  getOrganizationByExternalId,
  getEvent,
  getOrganizerByEventId,
  getOrganizationByUserId,
  getOrganizationByUserExternalId,
  getUserByEmail,
  getOrganizationWithMembersByOrganizationId,
  canModifyEvent,
  updateEventReminder,
  createEventReminder,
  getOrganizerByEmail,
} as const;

const assertions = {assertCanCreateEvent, assertCanJoinEvent} as const;

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
  telegram: Telegram;
  postmark: Postmark;
  mailQueue: MailQueue;
  googleMaps: GoogleMapsClient;
  cache: CacheService;
  stripe: Stripe;
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
    telegram: _opts.telegram,
    postmark: _opts.postmark,
    mailQueue: _opts.mailQueue,
    googleMaps: _opts.googleMaps,
    cache: _opts.cache,
    stripe: _opts.stripe,
  };
}

export type ActionContext = CreateInnerContextOptions;
export type AssertionContext = CreateInnerContextOptions;
export type Context = CreateContextOptions;

export async function createContext(
  opts?: CreateNextContextOptions
): Promise<Context> {
  const timezone =
    (opts?.req.headers['x-vercel-ip-timezone'] as string) ?? 'UTC';
  let auth = null;

  if (opts?.req) {
    auth = getAuth(opts?.req);
  }

  const innerContext: CreateInnerContextOptions = await createContextInner({
    auth,
    clerk,
    prisma,
    timezone,
    telegram: new Telegram(),
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
