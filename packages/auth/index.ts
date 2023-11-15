import {lucia} from 'lucia';
import {nextjs_future} from 'lucia/middleware';
import {google} from '@lucia-auth/oauth/providers';
import {prisma} from '@lucia-auth/adapter-prisma';
import {prisma as prismaClient} from 'database';
import {getBaseUrl} from 'utils';
import {User} from '@prisma/client';
import * as context from 'next/headers';

export const auth = lucia({
  adapter: prisma(prismaClient, {
    user: 'user',
    key: 'key',
    session: 'session',
  }),
  env: process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },
  getUserAttributes: (data) => data,
});

export const googleAuth = google(auth, {
  clientId: process.env.OAUTH_GOOGLE_CLIENT_ID!,
  clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET!,
  redirectUri: `${getBaseUrl()}/sign-in/google/callback`,
  scope: ['profile', 'email'],
});

export type Auth = typeof auth;

export const getPageSession = () => {
  const authRequest = auth.handleRequest('GET', context);

  return authRequest.validate() as Promise<{
    user: User;
    sessionId: string;
    activePeriodExpiresAt: string;
    idlePeriodExpiresAt: string;
    state: string;
    fresh: boolean;
  } | null>;
};
