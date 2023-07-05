import {Suspense} from 'react';
import {PublicProfile} from '../../(features)/PublicProfile/PublicProfile';
import {api} from '../../../trpc/server-http';
import {LoadingBlock} from 'ui';

export const generateMetadata = async ({
  params: {organizationId},
}: {
  params: {organizationId: string};
}) => {
  const organization = await api.organization.getOrganizationById.query({
    organizationId,
  });

  if (!organization) {
    return null;
  }

  return {
    title: `${organization.name} | WannaGo`,
  };
};

export default async function ProfilePage({
  params: {organizationId},
}: {
  params: {organizationId: string};
}) {
  const [
    organizationPromise,
    eventsPromise,
    followCountsPromise,
    amFollowingPromise,
  ] = [
    api.organization.getOrganizationById.query({
      organizationId,
    }),
    api.event.getPublicEvents.query({
      id: organizationId,
    }),
    api.follow.getFollowCounts.query({
      organizationId,
    }),
    api.follow.amFollowing.query({
      organizationId,
    }),
  ];

  return (
    <Suspense fallback={<LoadingBlock />}>
      <PublicProfile
        eventsPromise={eventsPromise}
        organizationPromise={organizationPromise}
        followCountsPromise={followCountsPromise}
        amFollowingPromise={amFollowingPromise}
      />
    </Suspense>
  );
}
