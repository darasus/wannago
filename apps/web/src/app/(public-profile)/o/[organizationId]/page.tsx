import {Suspense} from 'react';
import {api} from '../../../../trpc/server-http';
import {LoadingBlock} from 'ui';
import {PublicProfile} from 'features/src/PublicProfile/PublicProfile';
import {notFound} from 'next/navigation';

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
  const [organizationPromise, eventsPromise] = [
    api.organization.getOrganizationById.query({
      organizationId,
    }),
    api.event.getPublicEvents.query({
      id: organizationId,
    }),
  ];

  return (
    <Suspense fallback={<LoadingBlock />}>
      <PublicProfile
        eventsPromise={eventsPromise}
        organizationPromise={organizationPromise}
      />
    </Suspense>
  );
}
