import {User} from '@clerk/nextjs/dist/api';
import {clerkClient, getAuth} from '@clerk/nextjs/server';
import {PrismaClient} from '@prisma/client/edge';
import * as trpc from '@trpc/server';
import {prisma} from '../../../packages/database/prisma';
import {QStash} from '../lib/qStash';
import {Mail} from '../lib/mail';
import {FetchCreateContextFnOptions} from '@trpc/server/adapters/fetch';
import {NextRequest} from 'next/server';
import {Maps} from '../lib/maps';
import {Telegram} from '../lib/telegram';

interface CreateContextOptions {
  user: User | null;
  prisma: PrismaClient;
  mail: Mail;
  qStash: QStash;
  maps: Maps;
  timezone: string;
  telegram: Telegram;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  return {
    user: _opts.user,
    prisma: _opts.prisma,
    mail: _opts.mail,
    qStash: _opts.qStash,
    maps: _opts.maps,
    timezone: _opts.timezone,
    telegram: _opts.telegram,
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

  return await createContextInner({
    user,
    prisma,
    mail: new Mail(),
    qStash: new QStash(),
    maps: new Maps(),
    timezone,
    telegram: new Telegram(),
  });
}
