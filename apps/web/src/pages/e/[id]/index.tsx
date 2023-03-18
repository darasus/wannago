import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next';
import Head from 'next/head';
import {createProxySSGHelpers} from '@trpc/react-query/ssg';
import {AdminSection} from '../../../features/AdminSection/AdminSection';
import {EventView} from '../../../features/EventView/EventView';
import {Container, LoadingBlock, Spinner} from 'ui';
import {trpc} from 'trpc/src/trpc';
import {useEventId, useHandleEmailCallbackParam, useMe} from 'hooks';
import {appRouter} from 'trpc/src/routers/_app';
import {createContext} from 'trpc';
import SuperJSON from 'superjson';
import {ONE_WEEK_IN_SECONDS} from '../../../constants';

export default function EventPage() {
  useHandleEmailCallbackParam();
  const me = useMe();
  const {eventShortId} = useEventId();
  const {
    data: event,
    refetch,
    isLoading,
  } = trpc.event.getByShortId.useQuery(
    {
      id: eventShortId!,
    },
    {enabled: !!eventShortId}
  );
  const isMyEvent = event?.organizationId === me.data?.organizationId;

  if (isLoading) {
    return <LoadingBlock />;
  }

  return (
    <>
      {event && (
        <>
          <Head>
            <title>{`${event.title} | WannaGo`}</title>
          </Head>
          {isMyEvent && (
            <Container>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-4">
                  <AdminSection event={event} refetchEvent={refetch} />
                </div>
                <div className="col-span-12 lg:col-span-8">
                  <EventView event={event} />
                </div>
              </div>
            </Container>
          )}
          {!isMyEvent && (
            <Container maxSize="sm">
              <EventView event={event} />
            </Container>
          )}
        </>
      )}
    </>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<{id: string}>
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: SuperJSON,
  });
  const id = context.params?.id as string;
  await ssg.event.getByShortId.prefetch({id});

  context.res.setHeader(
    'Cache-Control',
    `s-maxage=10, stale-while-revalidate=${ONE_WEEK_IN_SECONDS}`
  );

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}
