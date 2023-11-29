import {notFound} from 'next/navigation';
import {api} from '../../../trpc/server-http';

import {AdminDashboard} from './features/AdminDashboard/AdminDashboard';

export default async function AdminPage() {
  const me = await api.user.me.query();

  if (me?.type !== 'ADMIN') {
    notFound();
  }

  const [usersCount, eventSignUpsCount, eventsCount, organizationsCount] =
    await Promise.all([
      api.admin.getUsersCount.query(),
      api.admin.getEventSignUpsCount.query(),
      api.admin.getEventsCount.query(),
      api.admin.getOrganizationsCount.query(),
    ]);
  const [
    dailyUserRegistrations,
    dailyEventSignUps,
    dailyCreatedEvents,
    dailyCreatedOrganizations,
  ] = await Promise.all([
    api.admin.getDailyUserRegistrations.query(),
    api.admin.getDailyEventSignUps.query(),
    api.admin.getDailyCreatedEvents.query(),
    api.admin.getDailyCreatedOrganizations.query(),
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

  const dailyCreatedOrganizationsData = Object.entries(
    dailyCreatedOrganizations || {}
  ).map((item) => {
    return {
      date: item[0],
      count: item[1],
    };
  });

  return (
    <AdminDashboard
      eventsCount={eventsCount}
      organizationsCount={organizationsCount}
      usersCount={usersCount}
      eventSignUpsCount={eventSignUpsCount}
      dailyCreatedEventSignUpsData={dailyEventSignUpsData}
      dailyCreatedEventsData={dailyEventsCreatedData}
      dailyCreatedUsersData={dailyUserRegistrationsData}
      dailyCreatedOrganizationsData={dailyCreatedOrganizationsData}
    />
  );
}
