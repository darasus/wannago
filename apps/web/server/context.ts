import {User} from '@clerk/nextjs/dist/api';
import {clerkClient, getAuth} from '@clerk/nextjs/server';
import {PrismaClient} from '@prisma/client';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import {prisma} from '../../../packages/database/prisma';
import {Client as GoogleMapsClient} from '@googlemaps/google-maps-services-js';
import {googleMaps} from '../lib/googleMaps';
import {QStash} from '../lib/qStash';
import {Mail} from '../lib/mail';
import {FetchCreateContextFnOptions} from '@trpc/server/adapters/fetch';
import {NextRequest} from 'next/server';

interface CreateContextOptions {
  user: User | null;
  prisma: PrismaClient;
  mail: Mail;
  qStash: QStash;
  googleMaps: GoogleMapsClient;
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
    googleMaps: _opts.googleMaps,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: FetchCreateContextFnOptions
): Promise<Context> {
  // for API-response caching see https://trpc.io/docs/caching
  async function getUser() {
    const {userId} = getAuth(opts.req as NextRequest);
    const user = userId ? await clerkClient.users.getUser(userId) : null;
    return user;
  }

  const user = await getUser();

  return await createContextInner({
    user,
    prisma,
    mail: new Mail(),
    qStash: new QStash(),
    googleMaps,
  });
}
