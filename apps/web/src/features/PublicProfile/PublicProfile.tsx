import {type RouterOutputs} from 'api';
import {EventCard} from 'features';
import Link from 'next/link';
import {Suspense} from 'react';
import {
  Avatar,
  Button,
  CardBase,
  Container,
  LoadingBlock,
  PageHeader,
  Text,
} from 'ui';
import {MessageButton} from './features/MessageButton/MessageButton';
import {FollowButton} from './features/FollowButton/FollowButton';
import {notFound} from 'next/navigation';

interface Props {
  isLoadingEvents?: boolean;
  eventsPromise: Promise<RouterOutputs['event']['getPublicEvents']>;
  userPromise?: Promise<RouterOutputs['user']['getUserById']>;
  organizationPromise?: Promise<
    RouterOutputs['organization']['getOrganizationById']
  >;
  followCountsPromise: Promise<RouterOutputs['follow']['getFollowCounts']>;
  amFollowingPromise: Promise<RouterOutputs['follow']['amFollowing']>;
}

export async function PublicProfile({
  isLoadingEvents,
  eventsPromise,
  userPromise,
  followCountsPromise,
  amFollowingPromise,
  organizationPromise,
}: Props) {
  const [events, user, organization] = await Promise.all([
    eventsPromise,
    userPromise,
    organizationPromise,
  ]);

  if ((userPromise && !user) || (organizationPromise && !organization)) {
    return notFound();
  }

  const getImageSrc = () => {
    if (user) {
      return user.profileImageSrc;
    }

    if (organization) {
      return organization.logoSrc;
    }
  };

  const getName = () => {
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }

    if (organization) {
      return organization.name;
    }
  };

  const imageSrc = getImageSrc();
  const name = getName();

  return (
    <>
      <Container maxSize="sm" className="flex flex-col gap-y-4">
        <CardBase innerClassName="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Avatar
              className="shrink-0 h-40 w-40"
              src={imageSrc}
              alt={`avatar`}
              height={700}
              width={700}
            />
            <div className="flex flex-col max-w-full overflow-hidden">
              <Text
                className="text-3xl font-bold truncate"
                data-testid="user-profile-name"
              >
                {name}
              </Text>
              <div className="flex md:justify-start justify-center gap-2">
                <div>
                  <Text className="font-bold" data-testid="follower-count">
                    <Suspense fallback="Loading...">
                      {(await followCountsPromise)?.followerCount || 0}
                    </Suspense>
                  </Text>
                  <Text className=""> followers</Text>
                </div>
                <div>
                  <Text className="font-bold">
                    <Suspense fallback="Loading...">
                      {(await followCountsPromise)?.followingCount || 0}
                    </Suspense>
                  </Text>
                  <Text> following</Text>
                </div>
              </div>
              <div className="flex md:justify-start justify-center gap-2 mt-4">
                <Suspense
                  fallback={
                    <Button disabled size={'sm'} variant={'outline'}>
                      Loading...
                    </Button>
                  }
                >
                  <FollowButton amFollowingPromise={amFollowingPromise} />
                </Suspense>
                <MessageButton />
              </div>
            </div>
          </div>
        </CardBase>
        {isLoadingEvents && <LoadingBlock />}
        {events && (
          <div>
            <PageHeader title="Events" />
          </div>
        )}
        {events && events?.length > 0 && (
          <div className="flex flex-col gap-4">
            {events.map((event) => {
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
        )}
        {!isLoadingEvents && events?.length === 0 && (
          <div className="flex justify-center p-4">
            <Text>No events yet...</Text>
          </div>
        )}
      </Container>
    </>
  );
}
