import {Suspense} from 'react';
import {api} from '../../../../trpc/server-http';
import {LoadingBlock} from 'ui';
import {PublicProfile} from '../../../../features/PublicProfile/PublicProfile';
import {notFound} from 'next/navigation';

export const runtime = 'edge';
export const preferredRegion = 'iad1';

export const generateMetadata = async ({
  params: {organizationId},
}: {
  params: {organizationId: string};
}) => {
  const organization = await api.organization.getOrganizationById
    .query({
      organizationId,
    })
    .catch(() => null);

  if (!organization) {
    return notFound();
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
