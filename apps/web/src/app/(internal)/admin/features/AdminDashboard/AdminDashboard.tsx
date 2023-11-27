'use client';

import Link from 'next/link';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Tooltip,
} from 'recharts';
import {Button, CardBase, Container, Text} from 'ui';
import {StatCard} from '../StatCard/StatCard';

interface AdminDashboardProps {
  usersCount: number;
  eventsCount: number;
  eventSignUpsCount: number;
  organizationsCount: number;
  dailyEventSignUpsData: Array<{
    date: string;
    count: number;
  }>;
  dailyUserRegistrationsData: Array<{
    date: string;
    count: number;
  }>;
  dailyEventsCreatedData: Array<{
    date: string;
    count: number;
  }>;
}

export function AdminDashboard({
  usersCount,
  eventsCount,
  organizationsCount,
  eventSignUpsCount,
  dailyEventsCreatedData,
  dailyEventSignUpsData,
  dailyUserRegistrationsData,
}: AdminDashboardProps) {
  return (
    <Container maxSize="full">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4">
        <CardBase
          className="lg:col-span-4"
          title="Total users count"
          titleChildren={
            <Button variant="link" size="sm" asChild className="p-0">
              <Link href="/admin/users">View all users</Link>
            </Button>
          }
        >
          <Text className="text-5xl">{usersCount}</Text>
        </CardBase>
        <CardBase
          className="lg:col-span-4"
          title="Total events count"
          titleChildren={
            <Button variant="link" size="sm" asChild className="p-0">
              <Link href="/admin/events">View all events</Link>
            </Button>
          }
        >
          <Text className="text-5xl">{eventsCount}</Text>
        </CardBase>
        <CardBase
          title="Total organizations count"
          className="lg:col-span-4"
          titleChildren={
            <Button variant="link" size="sm" asChild className="p-0">
              <Link href="/admin/organizations">View all organizations</Link>
            </Button>
          }
        >
          <Text className="text-5xl">{organizationsCount}</Text>
        </CardBase>
        <StatCard
          items={dailyUserRegistrationsData}
          value={usersCount.toString()}
          label={'Users'}
          secondaryLabel="Daily user registrations (last 14 days)"
        />
        <StatCard
          items={dailyEventSignUpsData}
          value={eventSignUpsCount.toString()}
          label={'Event sign ups'}
          secondaryLabel="Daily event sign ups (last 14 days)"
        />
        <StatCard
          items={dailyEventsCreatedData}
          value={eventsCount.toString()}
          label={'Events'}
          secondaryLabel="Daily events created (last 14 days)"
        />
        <CardBase
          className="lg:col-span-12"
          innerClassName="h-80"
          title="Daily registrations since start"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={dailyEventSignUpsData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis dataKey="count" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#000"
                activeDot={{r: 8}}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBase>
        <CardBase
          className="lg:col-span-12"
          innerClassName="h-80"
          title="Daily events created since start"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={dailyEventsCreatedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis dataKey="count" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#000"
                activeDot={{r: 8}}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBase>
      </div>
    </Container>
  );
}
