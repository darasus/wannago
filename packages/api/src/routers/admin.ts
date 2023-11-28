import {addDays, endOfToday, format, startOfDay, sub} from 'date-fns';
import {createTRPCRouter, adminProcedure} from '../trpc';

function createDateRange() {
  const startDate = startOfDay(sub(new Date(), {days: 14}));
  const endDate = endOfToday();
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

const getAllSignUps = adminProcedure.query(async ({ctx}) => {
  const registeredUsers = await ctx.prisma.eventSignUp.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      event: true,
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

const getDailyUserRegistrations = adminProcedure.query(async ({ctx}) => {
  const dateRange = createDateRange();
  const items = await ctx.prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  items.forEach((items) => {
    const date = format(new Date(items.createdAt), 'yyyy-MM-dd');

    if (dateRange.hasOwnProperty(date)) {
      dateRange[date]++;
    }
  });

  return dateRange;
});

const getDailyEventSignUps = adminProcedure.query(async ({ctx}) => {
  const dateRange = createDateRange();
  const items = await ctx.prisma.eventSignUp.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  items.forEach((item) => {
    const date = format(new Date(item.createdAt), 'yyyy-MM-dd');

    if (dateRange.hasOwnProperty(date)) {
      dateRange[date]++;
    }
  });

  return dateRange;
});

const getDailyCreatedEvents = adminProcedure.query(async ({ctx}) => {
  const dateRange = createDateRange();
  const items = await ctx.prisma.event.findMany();

  items.forEach((item) => {
    const date = format(new Date(item.createdAt), 'yyyy-MM-dd');

    if (dateRange.hasOwnProperty(date)) {
      dateRange[date]++;
    }
  });

  return dateRange;
});

const getDailyCreatedOrganizations = adminProcedure.query(async ({ctx}) => {
  const dateRange = createDateRange();
  const items = await ctx.prisma.organization.findMany();

  items.forEach((item) => {
    const date = format(new Date(item.createdAt), 'yyyy-MM-dd');

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

const getEventSignUpsCount = adminProcedure.query(async ({ctx}) => {
  return ctx.prisma.eventSignUp.count();
});

export const adminRouter = createTRPCRouter({
  getAllUsers,
  getAllEvents,
  getAllOrganizations,
  getAllSignUps,
  getUsersCount,
  getEventsCount,
  getOrganizationsCount,
  getDailyCreatedEvents,
  getDailyEventSignUps,
  getDailyUserRegistrations,
  getEventSignUpsCount,
  getDailyCreatedOrganizations,
});
