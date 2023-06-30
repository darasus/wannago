import {PublicProfile} from '../../(features)/PublicProfile/PublicProfile';
import {api} from '../../../trpc/server-http';

export const generateMetadata = async ({
  params: {userId},
}: {
  params: {userId: string};
}) => {
  const user = await api.user.getUserById.query({
    userId,
  });

  if (!user) {
    return null;
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

  const user = await userPromise;
  const events = await eventsPromise;

  if (!user) {
    return null;
  }

  return (
    <PublicProfile
      events={events || []}
      name={`${user.firstName} ${user.lastName}`}
      profileImageSrc={user.profileImageSrc}
      followCountsPromise={followCountsPromise}
      amFollowingPromise={amFollowingPromise}
    />
  );
}
