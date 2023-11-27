import {api} from '../../../trpc/server-http';

import {AdminDashboard} from './features/AdminDashboard/AdminDashboard';

export const runtime = 'nodejs';
export const preferredRegion = 'iad1';

export default async function AdminPage() {
  const [
    dailyUserRegistrations,
    dailyEventSignUps,
    dailyCreatedEvents,
    usersCount,
    eventSignUpsCount,
    eventsCount,
    organizationsCount,
  ] = await Promise.all([
    api.admin.getDailyUserRegistrations.query(),
    api.admin.getDailyEventSignUps.query(),
    api.admin.getDailyCreatedEvents.query(),
    api.admin.getUsersCount.query(),
    api.admin.getEventSignUpsCount.query(),
    api.admin.getEventsCount.query(),
    api.admin.getOrganizationsCount.query(),
  ]);

  const dailyUserRegistrationsData = Object.entries(
    dailyUserRegistrations || {}
  ).map((item) => {
    return {
      date: item[0],
      count: item[1] as number,
    };
  });

  const dailyEventSignUpsData = Object.entries(dailyEventSignUps || {}).map(
    (item) => {
      return {
        date: item[0],
        count: item[1] as number,
      };
    }
  );

  const dailyEventsCreatedData = Object.entries(dailyCreatedEvents || {}).map(
    (item) => {
      return {
        date: item[0],
        count: item[1] as number,
      };
    }
  );

  return (
    <AdminDashboard
      eventsCount={eventsCount}
      organizationsCount={organizationsCount}
      usersCount={usersCount}
      eventSignUpsCount={eventSignUpsCount}
      dailyEventSignUpsData={dailyEventSignUpsData}
      dailyEventsCreatedData={dailyEventsCreatedData}
      dailyUserRegistrationsData={dailyUserRegistrationsData}
    />
  );
}
