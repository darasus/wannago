import {EventCard} from 'cards';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {trpc} from 'trpc/src/trpc';
import {Avatar, CardBase, Container, LoadingBlock, PageHeader, Text} from 'ui';

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
    trpc.user.getUserProfileEvents.useQuery(
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
      <Container maxSize="sm" className="flex flex-col gap-y-4">
        <CardBase>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Avatar
              className="shrink-0 h-40 w-40"
              imageClassName="rounded-3xl"
              src={
                data?.profileImageSrc?.includes('gravatar')
                  ? undefined
                  : data?.profileImageSrc
              }
              alt={`avatar`}
              height={1000}
              width={1000}
            />
            {data && (
              <div className="flex max-w-full overflow-hidden">
                <Text
                  className="text-3xl font-bold truncate"
                  data-testid="user-profile-name"
                >{`${data.firstName} ${data.lastName}`}</Text>
              </div>
            )}
          </div>
        </CardBase>
        {isLoadingEvents && <LoadingBlock />}
        {userEvents && (
          <div>
            <PageHeader title="My events" />
          </div>
        )}
        {userEvents && userEvents?.length > 0 && (
          <div className="flex flex-col gap-4">
            {userEvents.map(event => {
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
        {!isLoadingEvents && userEvents?.length === 0 && (
          <div className="flex justify-center p-4">
            <Text>No events yet...</Text>
          </div>
        )}
      </Container>
    </>
  );
}
