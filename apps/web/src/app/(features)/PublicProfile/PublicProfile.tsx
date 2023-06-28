import {Event} from '@prisma/client';
import {RouterOutputs} from 'api';
import {EventCard} from 'cards';
import Link from 'next/link';
import {Suspense} from 'react';
import {Avatar, CardBase, Container, LoadingBlock, PageHeader, Text} from 'ui';
import {MessageButton} from './(features)/MessageButton/MessageButton';
import {FollowButton} from './(features)/FollowButton/FollowButton';

interface Props {
  isLoadingEvents?: boolean;
  profileImageSrc?: string | null;
  events: Event[];
  name: string;
  followCountsPromise: Promise<RouterOutputs['follow']['getFollowCounts']>;
  amFollowingPromise: Promise<RouterOutputs['follow']['amFollowing']>;
}

export async function PublicProfile({
  isLoadingEvents,
  events,
  name,
  profileImageSrc,
  followCountsPromise,
  amFollowingPromise,
}: Props) {
  const followCounts = await followCountsPromise;

  return (
    <>
      <Container maxSize="sm" className="flex flex-col gap-y-4">
        <CardBase innerClassName="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Avatar
              className="shrink-0 h-40 w-40"
              imageClassName="rounded-3xl"
              src={profileImageSrc}
              alt={`avatar`}
              height={1000}
              width={1000}
            />
            <div className="flex flex-col max-w-full overflow-hidden">
              <Text
                className="text-3xl font-bold truncate"
                data-testid="user-profile-name"
              >
                {name}
              </Text>
              <div className="flex gap-2">
                <div>
                  <Text className="font-bold" data-testid="follower-count">
                    <Suspense fallback="Loading...">
                      {followCounts?.followerCount || 0}
                    </Suspense>
                  </Text>
                  <Text className=""> followers</Text>
                </div>
                <div>
                  <Text className="font-bold">
                    <Suspense fallback="Loading...">
                      {followCounts?.followingCount || 0}
                    </Suspense>
                  </Text>
                  <Text> following</Text>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center md:justify-start gap-2">
            <MessageButton />
            <Suspense>
              <FollowButton amFollowingPromise={amFollowingPromise} />
            </Suspense>
          </div>
        </CardBase>
        {isLoadingEvents && <LoadingBlock />}
        {events && (
          <div>
            <PageHeader title="My events" />
          </div>
        )}
        {events && events?.length > 0 && (
          <div className="flex flex-col gap-4">
            {events.map(event => {
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
