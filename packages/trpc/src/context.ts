import {clerkClient, getAuth, createClerkClient} from '@clerk/nextjs/server';
import {PrismaClient} from '@prisma/client';
import * as trpc from '@trpc/server';
import {prisma} from 'database';
import {Telegram} from 'lib/src/telegram';
import {Postmark} from 'lib/src/postmark';
import {MailQueue} from 'lib/src/mailQueue';
import {type CreateNextContextOptions} from '@trpc/server/adapters/next';
import {Client as GoogleMapsClient} from '@googlemaps/google-maps-services-js';
import {SignedInAuthObject, SignedOutAuthObject} from '@clerk/clerk-sdk-node';

interface CreateContextOptions {
  auth: SignedInAuthObject | SignedOutAuthObject | null;
  clerk: ReturnType<typeof createClerkClient>;
  prisma: PrismaClient;
  timezone: string;
  telegram: Telegram;
  postmark: Postmark;
  mailQueue: MailQueue;
  googleMaps: GoogleMapsClient;
}

export async function createContextInner(_opts: CreateContextOptions) {
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

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

export async function createContext(
  opts?: CreateNextContextOptions
): Promise<Context> {
  const timezone =
    (opts?.req.headers['x-vercel-ip-timezone'] as string) ?? 'UTC';
  let auth = null;
  if (opts?.req) {
    auth = getAuth(opts?.req);
  }

  return createContextInner({
    auth,
    clerk: clerkClient,
    prisma,
    timezone,
    telegram: new Telegram(),
    postmark: new Postmark(),
    mailQueue: new MailQueue(),
    googleMaps: new GoogleMapsClient(),
  });
}
