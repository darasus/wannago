import {lucia} from 'lucia';
import {nextjs} from 'lucia/middleware';
import {google} from '@lucia-auth/oauth/providers';
import {prisma} from '@lucia-auth/adapter-prisma';
import {cache} from 'react';
import {cookies} from 'next/headers';
import {prisma as prismaClient} from 'database';
import {getBaseUrl} from 'utils';
import {User} from '@prisma/client';

export const auth = lucia({
  adapter: prisma(prismaClient, {
    user: 'user',
    key: 'key',
    session: 'session',
  }),
  env: process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
  middleware: nextjs(),
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

export const getPageSession = cache(() => {
  const authRequest = auth.handleRequest({
    request: null,
    cookies,
  });

  return authRequest.validate() as Promise<{
    user: User;
    sessionId: string;
    activePeriodExpiresAt: string;
    idlePeriodExpiresAt: string;
    state: string;
    fresh: boolean;
  } | null>;
});
