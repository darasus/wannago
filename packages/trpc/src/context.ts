import {User} from '@clerk/nextjs/dist/api';
import {clerkClient, getAuth} from '@clerk/nextjs/server';
import {PrismaClient} from '@prisma/client';
import * as trpc from '@trpc/server';
import {prisma} from 'database';
import {Maps} from 'lib/src/maps';
import {Telegram} from 'lib/src/telegram';
import {Postmark} from 'lib/src/postmark';
import {MailQueue} from 'lib/src/mailQueue';
import {type CreateNextContextOptions} from '@trpc/server/adapters/next';
import {Client as GoogleMapsClient} from '@googlemaps/google-maps-services-js';

interface CreateContextOptions {
  user: User | null;
  prisma: PrismaClient;
  timezone: string;
  telegram: Telegram;
  postmark: Postmark;
  mailQueue: MailQueue;
  googleMaps: GoogleMapsClient;
}

export async function createContextInner(_opts: CreateContextOptions) {
  return {
    user: _opts.user,
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

  async function getUser() {
    if (opts?.req) {
      const {userId} = getAuth(opts?.req);
      const user = userId ? await clerkClient.users.getUser(userId) : null;
      return user;
    }

    return null;
  }

  const user = await getUser();

  return createContextInner({
    user,
    prisma,
    timezone,
    telegram: new Telegram(),
    postmark: new Postmark(),
    mailQueue: new MailQueue(),
    googleMaps: new GoogleMapsClient(),
  });
}
