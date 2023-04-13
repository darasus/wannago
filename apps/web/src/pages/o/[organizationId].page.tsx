import Head from 'next/head';
import {useRouter} from 'next/router';
import {trpc} from 'trpc/src/trpc';
import {LoadingBlock} from 'ui';
import {PublicProfile} from './features/PublicProfile/PublicProfile';

export default function ProfilePage() {
  const router = useRouter();
  const organizationId = router.query.organizationId as string;
  const {data, isLoading: isLoadingUser} =
    trpc.organization.getOrganizationById.useQuery(
      {
        organizationId,
      },
      {
        enabled: Boolean(organizationId),
      }
    );
  const {data: userEvents, isLoading: isLoadingEvents} =
    trpc.event.getPublicEvents.useQuery(
      {
        id: organizationId,
      },
      {
        enabled: Boolean(organizationId),
      }
    );

  if (isLoadingUser) {
    return <LoadingBlock />;
  }

  return (
    <>
      <Head>
        <title>{`${data?.name} | WannaGo`}</title>
      </Head>
      <PublicProfile
        events={userEvents || []}
        name={data?.name || ''}
        profileImageSrc={data?.logoSrc}
        isLoadingEvents={isLoadingEvents}
      />
    </>
  );
}
