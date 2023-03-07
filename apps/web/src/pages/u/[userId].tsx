import {EventCard} from 'cards';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {trpc} from 'trpc/src/trpc';
import {Avatar, Container, Spinner, Text} from 'ui';
import AppLayout from '../../features/AppLayout/AppLayout';

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

  return (
    <AppLayout isLoading={isLoadingUser}>
      <Container>
        {user && user?.profileImageSrc && (
          <div className="flex flex-col items-center py-10">
            <Avatar
              className="h-40 w-40"
              imageClassName=""
              src={user?.profileImageSrc}
              alt={`avatar`}
              height={1000}
              width={1000}
            />
            <Text className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</Text>
          </div>
        )}
        {isLoadingEvents && (
          <div>
            <Spinner />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userEvents?.map(event => {
            return (
              <Link
                href={`/event/${event.id}`}
                key={event.id}
                data-testid="event-card"
              >
                <EventCard event={event} />
              </Link>
            );
          })}
        </div>
      </Container>
    </AppLayout>
  );
}
