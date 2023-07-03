import {Event} from '@prisma/client';
import {type RouterOutputs} from 'api';
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
  return (
    <>
      <Container maxSize="sm" className="flex flex-col gap-y-4">
        <CardBase innerClassName="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Avatar
              className="shrink-0 h-40 w-40"
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
              <div className="flex gap-2 justify-start mt-4">
                <Suspense>
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
            <PageHeader title="My events" />
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
