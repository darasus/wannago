import {addDays, format, startOfToday, sub} from 'date-fns';
import {createTRPCRouter, adminProcedure} from '../trpc';

function createDateRange() {
  const startDate = sub(new Date(), {days: 7});
  const endDate = startOfToday();
  const dateRange: Record<string, number> = {};

  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    const formattedDate = format(date, 'yyyy-MM-dd');
    dateRange[formattedDate] = 0;
  }

  return dateRange;
}

const getAllUsers = adminProcedure.query(async ({ctx}) => {
  const registeredUsers = await ctx.prisma.user.findMany({
    where: {
      externalId: {
        not: null,
      },
      email: {
        not: {
          contains: '+automation',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      events: {
        include: {
          eventSignUps: true,
        },
      },
    },
  });

  return registeredUsers;
});

const getAllOrganizations = adminProcedure.query(async ({ctx}) => {
  return ctx.prisma.organization.findMany({
    include: {
      events: {
        include: {
          eventSignUps: true,
        },
      },
    },
  });
});

const getAllEvents = adminProcedure.query(async ({ctx}) => {
  const allEvents = await ctx.prisma.event.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      user: {
        externalId: {
          not: null,
        },
        email: {
          not: {
            contains: '+automation',
          },
        },
      },
    },
  });

  return allEvents;
});

const getDailySignUps = adminProcedure.query(async ({ctx}) => {
  const dateRange = createDateRange();
  const allUsers = await ctx.prisma.user.findMany({
    where: {
      externalId: {
        not: null,
      },
      email: {
        not: {
          contains: '+automation',
        },
      },
    },
  });

  allUsers.forEach((user) => {
    const date = format(new Date(user.createdAt), 'yyyy-MM-dd');

    if (dateRange.hasOwnProperty(date)) {
      dateRange[date]++;
    }
  });

  return dateRange;
});

const getDailyCreatedEvents = adminProcedure.query(async ({ctx}) => {
  const dateRange = createDateRange();
  const allUsers = await ctx.prisma.event.findMany({
    where: {
      user: {
        externalId: {
          not: null,
        },
        email: {
          not: {
            contains: '+automation',
          },
        },
      },
    },
  });

  allUsers.forEach((user) => {
    const date = format(new Date(user.createdAt), 'yyyy-MM-dd');

    if (dateRange.hasOwnProperty(date)) {
      dateRange[date]++;
    }
  });

  return dateRange;
});

const getUsersCount = adminProcedure.query(async ({ctx}) => {
  return ctx.prisma.user.count({
    where: {
      externalId: {
        not: null,
      },
      email: {
        not: {
          contains: '+automation',
        },
      },
    },
  });
});

const getEventsCount = adminProcedure.query(async ({ctx}) => {
  return ctx.prisma.event.count({
    where: {
      user: {
        externalId: {
          not: null,
        },
        email: {
          not: {
            contains: '+automation',
          },
        },
      },
    },
  });
});

const getOrganizationsCount = adminProcedure.query(async ({ctx}) => {
  return ctx.prisma.organization.count();
});

export const adminRouter = createTRPCRouter({
  getAllUsers,
  getAllEvents,
  getAllOrganizations,
  getUsersCount,
  getEventsCount,
  getOrganizationsCount,
  getDailyCreatedEvents,
  getDailySignUps,
});
