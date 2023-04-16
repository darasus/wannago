import {Button, CardBase, Container, Text} from 'ui';
import {trpc} from 'trpc/src/trpc';
import {withProtected} from '../../utils/withAuthProtect';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts';

function AdminPage() {
  const dailySignUps = trpc.admin.getDailySignUps.useQuery();
  const dailyCreatedEvents = trpc.admin.getDailyCreatedEvents.useQuery();
  const usersCount = trpc.admin.getUsersCount.useQuery();
  const eventsCount = trpc.admin.getEventsCount.useQuery();
  const organizationsCount = trpc.admin.getOrganizationsCount.useQuery();

  const dailySignUpsData = Object.entries(dailySignUps.data || {}).map(
    signUp => {
      return {
        date: signUp[0],
        count: signUp[1],
      };
    }
  );

  const dailyEventsCreatedData = Object.entries(
    dailyCreatedEvents.data || {}
  ).map(signUp => {
    return {
      date: signUp[0],
      count: signUp[1],
    };
  });

  return (
    <Container maxSize="full">
      <div className="grid grid-cols-12 gap-4">
        <CardBase
          title="Total users count"
          titleChildren={
            <Button variant="neutral" size="xs" as="a" href="/admin/users">
              View all users
            </Button>
          }
          className="col-span-4"
        >
          <Text className="text-5xl">{usersCount.data}</Text>
        </CardBase>
        <CardBase
          title="Total events count"
          className="col-span-4"
          titleChildren={
            <Button variant="neutral" size="xs" as="a" href="/admin/events">
              View all events
            </Button>
          }
        >
          <Text className="text-5xl">{eventsCount.data}</Text>
        </CardBase>
        <CardBase
          title="Total organizations count"
          className="col-span-4"
          titleChildren={
            <Button
              variant="neutral"
              size="xs"
              as="a"
              href="/admin/organizations"
            >
              View all organizations
            </Button>
          }
        >
          <Text className="text-5xl">{organizationsCount.data}</Text>
        </CardBase>
        <CardBase
          className="col-span-12"
          innerClassName="h-80"
          title="Daily registrations since start"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={dailySignUpsData}
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
          className="col-span-12"
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

export default withProtected(AdminPage);
