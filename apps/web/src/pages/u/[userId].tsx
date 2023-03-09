import {EventCard} from 'cards';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {trpc} from 'trpc/src/trpc';
import {Avatar, CardBase, Container, PageHeader, Spinner, Text} from 'ui';
import {EventWannaGoArea} from '../../features/EventWannaGoArea/EventWannaGoArea';

export default function ProfilePage() {
  const router = useRouter();
  const userId = router.query.userId as string;
  const {data: user, isLoading: isLoadingUser} = trpc.user.getUserById.useQuery(
    {
      userId,
    },
    {
      enabled: !!userId,
    }
  );
  const {data: userEvents, isLoading: isLoadingEvents} =
    trpc.user.getUserProfileEvents.useQuery(
      {
        userId,
      },
      {
        enabled: !!userId,
      }
    );

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <Container maxSize="sm" className="flex flex-col gap-y-4">
      {user && user?.profileImageSrc && (
        <CardBase>
          <div className="flex gap-x-4 items-center">
            <Avatar
              className="h-40 w-40"
              imageClassName="rounded-3xl"
              src={user?.profileImageSrc}
              alt={`avatar`}
              height={1000}
              width={1000}
            />
            <Text className="text-3xl font-bold">{`${user.firstName} ${user.lastName}`}</Text>
          </div>
        </CardBase>
      )}
      {isLoadingEvents && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {userEvents && (
        <div>
          <PageHeader title="My events" />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userEvents?.map(event => {
          return (
            <Link
              href={`/e/${event.shortId}`}
              key={event.id}
              data-testid="event-card"
            >
              <EventCard event={event} />
            </Link>
          );
        })}
      </div>
      {userEvents?.length === 0 && (
        <div className="flex justify-center p-4">
          <Text>No events yet...</Text>
        </div>
      )}
      <EventWannaGoArea />
    </Container>
  );
}
