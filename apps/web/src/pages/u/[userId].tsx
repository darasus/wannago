import Head from 'next/head';
import {useRouter} from 'next/router';
import {trpc} from 'trpc/src/trpc';
import {LoadingBlock} from 'ui';
import {PublicProfile} from '../../features/PublicProfile/PublicProfile';

export default function ProfilePage() {
  const router = useRouter();
  const userId = router.query.userId as string;
  const {data, isLoading: isLoadingUser} = trpc.user.getUserById.useQuery(
    {
      userId,
    },
    {
      enabled: !!userId,
    }
  );
  const {data: userEvents, isLoading: isLoadingEvents} =
    trpc.user.getPublicUserEvents.useQuery(
      {
        userId,
      },
      {
        enabled: !!userId,
      }
    );

  if (isLoadingUser) {
    return <LoadingBlock />;
  }

  return (
    <>
      <Head>
        <title>{`${data?.firstName} ${data?.lastName} | WannaGo`}</title>
      </Head>
      <PublicProfile
        events={userEvents || []}
        name={`${data?.firstName} ${data?.lastName}`}
        profileImageSrc={data?.profileImageSrc}
        isLoadingEvents={isLoadingEvents}
      />
    </>
  );
}
