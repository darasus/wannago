import {GetServerSidePropsContext} from 'next';
import {createProxySSGHelpers} from '@trpc/react-query/ssg';
import {AdminSection} from '../../../features/AdminSection/AdminSection';
import {EventView} from '../../../features/EventView/EventView';
import {Container, LoadingBlock} from 'ui';
import {trpc} from 'trpc/src/trpc';
import {useEventId, useHandleEmailCallbackParam, useMe, useMyUser} from 'hooks';
import {appRouter} from 'trpc/src/routers/_app';
import {createContext} from 'trpc';
import SuperJSON from 'superjson';
import {ONE_WEEK_IN_SECONDS} from '../../../constants';
import {Meta} from '../../../components/Meta/Meta';
import {createOGImageEventUrl, stripHTML} from 'utils';

export default function EventPage() {
  useHandleEmailCallbackParam();
  const user = useMyUser();
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
  const isMyEvent = event?.organizationId === user.data?.organizationId;

  if (isLoading) {
    return <LoadingBlock />;
  }

  return (
    <>
      {event && (
        <>
          <Meta
            title={event.title}
            description={`${stripHTML(event?.description || '').slice(
              0,
              100
            )}...`}
            imageSrc={
              event.featuredImageSrc &&
              user.data?.profileImageSrc &&
              createOGImageEventUrl({
                title: event.title,
                organizerName: `${user.data?.firstName} ${user.data?.lastName}`,
                eventImageUrl: event.featuredImageSrc,
                organizerProfileImageUrl: user.data?.profileImageSrc,
              })
            }
            shortEventId={event.shortId!}
          />
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
