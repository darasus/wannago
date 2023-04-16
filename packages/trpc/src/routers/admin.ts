import {addDays, format, startOfToday} from 'date-fns';
import {router, adminProcedure} from '../trpcServer';

function createDateRange() {
  const startDate = new Date('2023-01-01T00:00:00');
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
  });

  return allEvents;
});

const getDailySignUps = adminProcedure.query(async ({ctx}) => {
  const dateRange = createDateRange();
  const allUsers = await ctx.prisma.user.findMany();

  allUsers.forEach(user => {
    const date = format(new Date(user.createdAt), 'yyyy-MM-dd');

    if (dateRange.hasOwnProperty(date)) {
      dateRange[date]++;
    }
  });

  return dateRange;
});

const getDailyCreatedEvents = adminProcedure.query(async ({ctx}) => {
  const dateRange = createDateRange();
  const allUsers = await ctx.prisma.event.findMany();

  allUsers.forEach(user => {
    const date = format(new Date(user.createdAt), 'yyyy-MM-dd');

    if (dateRange.hasOwnProperty(date)) {
      dateRange[date]++;
    }
  });

  return dateRange;
});

const getUsersCount = adminProcedure.query(async ({ctx}) => {
  return ctx.prisma.user.count();
});

const getEventsCount = adminProcedure.query(async ({ctx}) => {
  return ctx.prisma.event.count();
});

const getOrganizationsCount = adminProcedure.query(async ({ctx}) => {
  return ctx.prisma.organization.count();
});

export const adminRouter = router({
  // all
  getAllUsers,
  getAllEvents,
  getAllOrganizations,
  // counts
  getUsersCount,
  getEventsCount,
  getOrganizationsCount,
  // daily stats
  getDailyCreatedEvents,
  getDailySignUps,
});
