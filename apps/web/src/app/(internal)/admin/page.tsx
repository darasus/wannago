import {api} from '../../../trpc/server-http';

import {AdminDashboard} from './features/AdminDashboard/AdminDashboard';

export const runtime = 'edge';
export const preferredRegion = 'iad1';

export default async function AdminPage() {
  const [
    dailySignUps,
    dailyCreatedEvents,
    usersCount,
    eventsCount,
    organizationsCount,
  ] = await Promise.all([
    api.admin.getDailySignUps.query(),
    api.admin.getDailyCreatedEvents.query(),
    api.admin.getUsersCount.query(),
    api.admin.getEventsCount.query(),
    api.admin.getOrganizationsCount.query(),
  ]);

  const dailySignUpsData = Object.entries(dailySignUps || {}).map((signUp) => {
    return {
      date: signUp[0],
      count: signUp[1] as number,
    };
  });
  const dailyEventsCreatedData = Object.entries(dailyCreatedEvents || {}).map(
    (signUp) => {
      return {
        date: signUp[0],
        count: signUp[1] as number,
      };
    }
  );

  return (
    <AdminDashboard
      eventsCount={usersCount}
      organizationsCount={organizationsCount}
      usersCount={eventsCount}
      dailySignUpsData={dailySignUpsData}
      dailyEventsCreatedData={dailyEventsCreatedData}
    />
  );
}
