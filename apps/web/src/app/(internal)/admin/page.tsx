import {notFound} from 'next/navigation';
import {api} from '../../../trpc/server-http';

import {AdminDashboard} from './features/AdminDashboard/AdminDashboard';

export default async function AdminPage() {
  const me = await api.user.me.query();

  if (me?.type !== 'ADMIN') {
    notFound();
  }

  const [usersCount, eventSignUpsCount, eventsCount] = await Promise.all([
    api.admin.getUsersCount.query(),
    api.admin.getEventSignUpsCount.query(),
    api.admin.getEventsCount.query(),
  ]);
  const [dailyUserRegistrations, dailyEventSignUps, dailyCreatedEvents] =
    await Promise.all([
      api.admin.getDailyUserRegistrations.query(),
      api.admin.getDailyEventSignUps.query(),
      api.admin.getDailyCreatedEvents.query(),
    ]);

  const dailyUserRegistrationsData = Object.entries(
    dailyUserRegistrations || {}
  ).map((item) => {
    return {
      date: item[0],
      count: item[1],
    };
  });

  const dailyEventSignUpsData = Object.entries(dailyEventSignUps || {}).map(
    (item) => {
      return {
        date: item[0],
        count: item[1],
      };
    }
  );

  const dailyEventsCreatedData = Object.entries(dailyCreatedEvents || {}).map(
    (item) => {
      return {
        date: item[0],
        count: item[1],
      };
    }
  );

  return (
    <AdminDashboard
      eventsCount={eventsCount}
      usersCount={usersCount}
      eventSignUpsCount={eventSignUpsCount}
      dailyCreatedEventSignUpsData={dailyEventSignUpsData}
      dailyCreatedEventsData={dailyEventsCreatedData}
      dailyCreatedUsersData={dailyUserRegistrationsData}
    />
  );
}
