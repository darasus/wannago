import {createProxySSGHelpers} from '@trpc/react-query/ssg';
import {EventCard} from 'cards';
import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import SuperJSON from 'superjson';
import {createContext} from 'trpc';
import {appRouter} from 'trpc/src/routers/_app';
import {trpc} from 'trpc/src/trpc';
import {Avatar, CardBase, Container, PageHeader, Spinner, Text} from 'ui';

export default function ProfilePage({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const userId = router.query.userId as string;
  const {data, isLoading: isLoadingUser} = trpc.user.getUserById.useQuery(
    {
      userId,
    },
    {
      enabled: !!userId,
      initialData: SuperJSON.parse(user),
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
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Spinner />
      </div>
    );
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
                <Text className="text-3xl font-bold truncate">{`${data.firstName} ${data.lastName}`}</Text>
              </div>
            )}
          </div>
        </CardBase>
        {isLoadingEvents && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
        {userEvents && (
          <div>
            <PageHeader title="My events" />
          </div>
        )}
        <div className="flex flex-col gap-4">
          {userEvents?.map(event => {
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
        {userEvents?.length === 0 && (
          <div className="flex justify-center p-4">
            <Text>No events yet...</Text>
          </div>
        )}
      </Container>
    </>
  );
}

export async function getServerSideProps({
  req,
  res,
  params,
}: GetServerSidePropsContext<{userId: string}>) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: SuperJSON,
  });

  const user = await ssg.user.getUserById.fetch({userId: params?.userId!});

  const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
  res.setHeader(
    'Cache-Control',
    `s-maxage=10, stale-while-revalidate=${ONE_WEEK_IN_SECONDS}`
  );

  return {
    props: {
      user: SuperJSON.stringify(user),
    },
  };
}
