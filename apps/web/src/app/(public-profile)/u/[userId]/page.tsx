import {Suspense} from 'react';
import {api} from '../../../../trpc/server-http';
import {LoadingBlock} from 'ui';
import {PublicProfile} from 'features/src/PublicProfile/PublicProfile';
import {notFound} from 'next/navigation';

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
  const [userPromise, eventsPromise] = [
    api.user.getUserById.query({
      userId,
    }),
    api.event.getPublicEvents.query({
      id: userId,
    }),
  ];

  return (
    <Suspense fallback={<LoadingBlock />}>
      <PublicProfile userPromise={userPromise} eventsPromise={eventsPromise} />
    </Suspense>
  );
}
