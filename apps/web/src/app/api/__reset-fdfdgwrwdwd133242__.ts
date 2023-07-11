import {env} from 'server-env';
import {
  organization_1_id,
  organization_2_id,
  user_1_id,
  user_2_id,
} from '../../../../../__checks__/constants';
import {prisma} from 'database';

export const runtime = 'edge';

export async function POST(req: Request) {
  if (env.VERCEL_ENV === 'production') {
    return null;
  }

  await resetDB();

  return new Response(JSON.stringify({success: true}), {status: 200});
}

export async function resetDB() {
  const user_1 = await prisma.user.findUnique({
    where: {
      id: user_1_id,
    },
  });
  const user_2 = await prisma.user.findUnique({
    where: {
      id: user_2_id,
    },
  });
  const organization_1 = await prisma.organization.findUnique({
    where: {
      id: organization_1_id,
    },
  });
  const organization_2 = await prisma.organization.findUnique({
    where: {
      id: organization_2_id,
    },
  });

  if (!user_1 || !user_2 || !organization_1 || !organization_2) {
    return;
  }

  await prisma.follow.deleteMany({
    where: {
      OR: [
        {
          followerUserId: user_1.id,
        },
        {
          followerUserId: user_2.id,
        },
        {
          followingUserId: user_1.id,
        },
        {
          followingUserId: user_2.id,
        },
        {
          followingOrganizationId: organization_1.id,
        },
        {
          followingOrganizationId: organization_2.id,
        },
      ],
    },
  });
  await prisma.eventSignUp.deleteMany({
    where: {
      OR: [
        {
          event: {
            userId: user_1.id,
          },
        },
        {
          event: {
            userId: user_2.id,
          },
        },
        {
          event: {
            organizationId: organization_1.id,
          },
        },
        {
          event: {
            organizationId: organization_2.id,
          },
        },
      ],
    },
  });
  await prisma.event.deleteMany({
    where: {
      OR: [
        {
          userId: user_1.id,
        },
        {
          userId: user_2.id,
        },
        {
          organizationId: organization_1.id,
        },
        {
          organizationId: organization_2.id,
        },
      ],
    },
  });
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        {
          users: {
            some: {
              id: user_1.id,
            },
          },
        },
        {
          users: {
            some: {
              id: user_2.id,
            },
          },
        },
        {
          organizations: {
            some: {
              id: organization_1.id,
            },
          },
        },
        {
          organizations: {
            some: {
              id: organization_2.id,
            },
          },
        },
      ],
    },
  });
  await prisma.message.deleteMany({
    where: {
      conversationId: {
        in: conversations.map((conversation) => conversation.id),
      },
    },
  });
  await prisma.conversationLastSeen.deleteMany({
    where: {
      conversationId: {
        in: conversations.map((conversation) => conversation.id),
      },
    },
  });
  await prisma.conversation.deleteMany({
    where: {
      OR: [
        {
          id: {
            in: conversations.map((conversation) => conversation.id),
          },
        },
      ],
    },
  });
}
