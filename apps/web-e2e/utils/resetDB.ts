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

  if (!user_1 || !user_2) {
    return;
  }

  await prisma.eventSignUp.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
}
