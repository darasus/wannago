import Link from 'next/link';
import {Button} from 'ui';

import {api} from '../../../../../trpc/server-http';
import {StatCard} from '../StatCard/StatCard';

export async function AdminDashboard() {
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
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4">
      <StatCard
        items={dailyUserRegistrationsData}
        value={usersCount.toString()}
        label={
          <div className="flex gap-2 items-center">
            <span>Users</span>
            <Button variant="link" size="sm" asChild>
              <Link href="/admin/users">View all users</Link>
            </Button>
          </div>
        }
        secondaryLabel="Daily user registrations (last 14 days)"
      />
      <StatCard
        items={dailyEventSignUpsData}
        value={eventSignUpsCount.toString()}
        label={
          <div className="flex gap-2 items-center">
            <span>Event Sign Ups</span>
            <Button variant="link" size="sm" asChild>
              <Link href="/admin/sign-ups">View all sign ups</Link>
            </Button>
          </div>
        }
        secondaryLabel="Daily event sign ups (last 14 days)"
      />
      <StatCard
        items={dailyEventsCreatedData}
        value={eventsCount.toString()}
        label={
          <div className="flex gap-2 items-center">
            <span>Events</span>
            <Button variant="link" size="sm" asChild>
              <Link href="/admin/events">View all events</Link>
            </Button>
          </div>
        }
        secondaryLabel="Daily events created (last 14 days)"
      />
    </div>
  );
}
