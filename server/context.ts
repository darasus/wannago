import {User} from '@clerk/nextjs/dist/api';
import {clerkClient, getAuth} from '@clerk/nextjs/server';
import {PrismaClient} from '@prisma/client';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import MailgunClient from 'mailgun.js/client';
import {mailgun} from '../lib/mailgun';
import {prisma} from '../lib/prisma';

interface CreateContextOptions {
  user: User | null;
  prisma: PrismaClient;
  mailgun: MailgunClient;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  return {
    user: _opts.user,
    prisma: _opts.prisma,
    mailgun: _opts.mailgun,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  // for API-response caching see https://trpc.io/docs/caching
  async function getUser() {
    const {userId} = getAuth(opts.req);
    const user = userId ? await clerkClient.users.getUser(userId) : null;
    return user;
  }

  const user = await getUser();

  return await createContextInner({user, prisma, mailgun});
}
