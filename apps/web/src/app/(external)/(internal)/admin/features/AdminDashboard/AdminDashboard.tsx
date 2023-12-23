'use client';

import Link from 'next/link';

import {Button, Container} from 'ui';
import {StatCard} from '../StatCard/StatCard';

interface DataPoint {
  date: string;
  count: number;
}

interface AdminDashboardProps {
  usersCount: number;
  eventsCount: number;
  eventSignUpsCount: number;
  organizationsCount: number;

  dailyCreatedEventSignUpsData: DataPoint[];
  dailyCreatedUsersData: DataPoint[];
  dailyCreatedEventsData: DataPoint[];
  dailyCreatedOrganizationsData: DataPoint[];
}

export function AdminDashboard({
  usersCount,
  eventsCount,
  organizationsCount,
  eventSignUpsCount,
  dailyCreatedEventSignUpsData,
  dailyCreatedEventsData,
  dailyCreatedOrganizationsData,
  dailyCreatedUsersData,
}: AdminDashboardProps) {
  return (
    <Container maxSize="full">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4">
        <StatCard
          items={dailyCreatedUsersData}
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
          items={dailyCreatedEventSignUpsData}
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
          items={dailyCreatedEventsData}
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
        <StatCard
          items={dailyCreatedOrganizationsData}
          value={organizationsCount.toString()}
          label={
            <div className="flex gap-2 items-center">
              <span>Organizations</span>
              <Button variant="link" size="sm" asChild>
                <Link href="/admin/organizations">View all organizations</Link>
              </Button>
            </div>
          }
          secondaryLabel="Daily events created (last 14 days)"
        />
      </div>
    </Container>
  );
}
