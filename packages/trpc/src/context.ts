import {User} from '@clerk/nextjs/dist/api';
import {clerkClient, getAuth} from '@clerk/nextjs/server';
import {PrismaClient} from '@prisma/client/edge';
import * as trpc from '@trpc/server';
import {prisma} from 'database';
import {QStash} from 'lib/src/qStash';
import {FetchCreateContextFnOptions} from '@trpc/server/adapters/fetch';
import {NextRequest} from 'next/server';
import {Maps} from 'lib/src/maps';
import {Telegram} from 'lib/src/telegram';
import {Postmark} from 'lib/src/postmark';
import {MailQueue} from 'lib/src/mailQueue';

interface CreateContextOptions {
  user: User | null;
  prisma: PrismaClient;
  qStash: QStash;
  maps: Maps;
  timezone: string;
  telegram: Telegram;
  postmark: Postmark;
  mailQueue: MailQueue;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  return {
    user: _opts.user,
    prisma: _opts.prisma,
    qStash: _opts.qStash,
    maps: _opts.maps,
    timezone: _opts.timezone,
    telegram: _opts.telegram,
    postmark: _opts.postmark,
    mailQueue: _opts.mailQueue,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts?: FetchCreateContextFnOptions
): Promise<Context> {
  const timezone = opts?.req.headers.get('x-vercel-ip-timezone') ?? 'UTC';

  async function getUser() {
    if (opts?.req) {
      const {userId} = getAuth(opts?.req as NextRequest);
      const user = userId ? await clerkClient.users.getUser(userId) : null;
      return user;
    }

    return null;
  }

  const user = await getUser();

  return createContextInner({
    user,
    prisma,
    qStash: new QStash(),
    maps: new Maps(),
    timezone,
    telegram: new Telegram(),
    postmark: new Postmark(),
    mailQueue: new MailQueue(),
  });
}