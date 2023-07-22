import {Suspense} from 'react';
import {api} from '../../../../trpc/server-http';
import {LoadingBlock} from 'ui';
import {PublicProfile} from '../../../../features/PublicProfile/PublicProfile';
import {notFound} from 'next/navigation';

export const runtime = 'edge';
export const preferredRegion = 'iad1';

export const generateMetadata = async ({
  params: {userId},
}: {
  params: {userId: string};
}) => {
  const user = await api.user.getUserById
    .query({
      userId,
    })
    .catch(() => null);

  if (!user) {
    return notFound();
  }

  return {
    title: `${user.firstName} ${user.lastName} | WannaGo`,
  };
};

export default async function ProfilePage({
  params: {userId},
}: {
  params: {userId: string};
}) {
  const [userPromise, eventsPromise, followCountsPromise, amFollowingPromise] =
    [
      api.user.getUserById.query({
        userId,
      }),
      api.event.getPublicEvents.query({
        id: userId,
      }),
      api.follow.getFollowCounts.query({
        userId,
      }),
      api.follow.amFollowing.query({
        userId,
      }),
    ];

  return (
    <Suspense fallback={<LoadingBlock />}>
      <PublicProfile
        userPromise={userPromise}
        eventsPromise={eventsPromise}
        followCountsPromise={followCountsPromise}
        amFollowingPromise={amFollowingPromise}
      />
    </Suspense>
  );
}
