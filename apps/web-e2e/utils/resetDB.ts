import {PrismaClient} from '@prisma/client';

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
      id: '52cb62d5-c6ca-4da3-be41-d1c3a83dfa21',
    },
  });
  const user_2 = await prisma.user.findUnique({
    where: {
      id: 'ba2c68ad-f288-43c5-b3c5-6bfcc3611a98',
    },
  });
  const organization_1 = await prisma.organization.findUnique({
    where: {
      id: '5d78757d-c68b-45fd-8954-0e14cb0b6753',
    },
  });
  const organization_2 = await prisma.organization.findUnique({
    where: {
      id: 'ba2c68ad-f288-43c5-b3c5-6bfcc3611a98',
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
      ],
    },
  });
  await prisma.message.deleteMany({
    where: {
      OR: [
        {
          conversation: {
            users: {
              some: {
                id: user_1.id,
              },
            },
          },
        },
        {
          conversation: {
            users: {
              some: {
                id: user_2.id,
              },
            },
          },
        },
      ],
    },
  });
  const conversations = await await prisma.conversation.findMany({
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

  await prisma.conversationLastSeen.deleteMany({
    where: {
      OR: [
        {
          id: {
            in: conversations.map(conversation => conversation.id),
          },
        },
      ],
    },
  });
  await prisma.conversation.deleteMany({
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
      ],
    },
  });
}
