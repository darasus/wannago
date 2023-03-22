import {clerkClient, getAuth, createClerkClient} from '@clerk/nextjs/server';
import {PrismaClient} from '@prisma/client';
import {prisma} from 'database';
import {Telegram} from 'lib/src/telegram';
import {Postmark} from 'lib/src/postmark';
import {MailQueue} from 'lib/src/mailQueue';
import {type CreateNextContextOptions} from '@trpc/server/adapters/next';
import {Client as GoogleMapsClient} from '@googlemaps/google-maps-services-js';
import {SignedInAuthObject, SignedOutAuthObject} from '@clerk/clerk-sdk-node';
import {getEvents} from './actions/getEvents';
import {getUserByExternalId} from './actions/getUserByExternalId';
import {getUserById} from './actions/getUserById';

type Actions = {
  getEvents: ReturnType<typeof getEvents>;
  getUserByExternalId: ReturnType<typeof getUserByExternalId>;
  getUserById: ReturnType<typeof getUserById>;
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
}

interface CreateContextOptions extends CreateInnerContextOptions {
  actions: Actions;
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
  };
}

export type ActionContext = CreateInnerContextOptions;
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
    clerk: clerkClient,
    prisma,
    timezone,
    telegram: new Telegram(),
    postmark: new Postmark(),
    mailQueue: new MailQueue(),
    googleMaps: new GoogleMapsClient(),
  });

  return {
    ...innerContext,
    actions: {
      getEvents: getEvents(innerContext),
      getUserByExternalId: getUserByExternalId(innerContext),
      getUserById: getUserById(innerContext),
    },
  };
}
