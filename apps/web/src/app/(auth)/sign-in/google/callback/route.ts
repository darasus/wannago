import {OAuthRequestError} from '@lucia-auth/oauth';
import {cookies} from 'next/headers';
import {v4 as uuid} from 'uuid';
import type {NextRequest} from 'next/server';
import {auth, googleAuth} from 'auth';
import {prisma} from 'database';

export const GET = async (request: NextRequest) => {
  const authRequest = auth.handleRequest({request, cookies});
  const session = await authRequest.validate();

  if (session) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  }

  const cookieStore = cookies();
  const storedState = cookieStore.get('google_oauth_state')?.value;
  const url = new URL(request.url);
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const {existingUser, createUser, googleUser} =
      await googleAuth.validateCallback(code);

    const getUser = async () => {
      if (existingUser) {
        if (existingUser.email_verified === false) {
          await prisma.user.update({
            where: {
              id: existingUser.id,
            },
            data: {
              email_verified: true,
            },
          });
        }

        return existingUser;
      }

      if (!existingUser) {
        const databaseUser = await prisma.user.findFirst({
          where: {
            email: googleUser.email,
          },
        });

        if (databaseUser) {
          await prisma.key.create({
            data: {
              id: `google:${googleUser.sub}`,
              user: {
                connect: {
                  id: databaseUser.id,
                },
              },
            },
          });

          if (databaseUser.email_verified === false) {
            await prisma.user.update({
              where: {
                id: databaseUser.id,
              },
              data: {
                email_verified: true,
              },
            });
          }

          return {...databaseUser, userId: databaseUser.id};
        }
      }

      const user = await createUser({
        userId: uuid(),
        attributes: {
          email: googleUser.email,
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          email_verified: true,
        },
      });

      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    authRequest.setSession(session);

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  } catch (e: any) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
};
