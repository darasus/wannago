import {PrismaClient} from '@prisma/client';
import {users} from '../constants';

export async function resetDB() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  const user_1 = await prisma.user.findUnique({
    where: {
      id: users.user_1.id,
    },
  });
  const user_2 = await prisma.user.findUnique({
    where: {
      id: users.user_2.id,
    },
  });
  const organization_1 = await prisma.organization.findUnique({
    where: {
      id: users.user_1.organization.id,
    },
  });
  const organization_2 = await prisma.organization.findUnique({
    where: {
      id: users.user_2.organization.id,
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
  await prisma.ticket.deleteMany({
    where: {
      event: {
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
