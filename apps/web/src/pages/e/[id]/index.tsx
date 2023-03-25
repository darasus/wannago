import {GetServerSidePropsContext} from 'next';
import {createProxySSGHelpers} from '@trpc/react-query/ssg';
import {AdminSection} from '../../../features/AdminSection/AdminSection';
import {EventView} from '../../../features/EventView/EventView';
import {Container, LoadingBlock} from 'ui';
import {
  useEventId,
  useEventQuery,
  useHandleEmailCallbackParam,
  useIsMyEvent,
  useMyUserQuery,
} from 'hooks';
import {appRouter} from 'trpc/src/routers/_app';
import {createContext} from 'trpc';
import SuperJSON from 'superjson';
import {ONE_WEEK_IN_SECONDS} from '../../../constants';
import {Meta} from '../../../components/Meta/Meta';
import {createOGImageEventUrl, stripHTML} from 'utils';

export default function EventPage() {
  useHandleEmailCallbackParam();
  const user = useMyUserQuery();
  const {eventShortId} = useEventId();
  const event = useEventQuery({eventShortId});
  const isMyEvent = useIsMyEvent({eventShortId});

  console.log({isMyEvent});

  if (event.isLoading) {
    return <LoadingBlock />;
  }

  return (
    <>
      {event && (
        <>
          <Meta
            title={event.data?.title}
            description={`${stripHTML(event.data?.description || '').slice(
              0,
              100
            )}...`}
            imageSrc={
              event.data?.featuredImageSrc &&
              user.data?.profileImageSrc &&
              createOGImageEventUrl({
                title: event.data.title,
                organizerName: `${user.data?.firstName} ${user.data?.lastName}`,
                eventImageUrl: event.data.featuredImageSrc,
                organizerProfileImageUrl: user.data?.profileImageSrc,
              })
            }
            shortEventId={event.data?.shortId}
          />
          {isMyEvent && event.data && (
            <Container>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-4">
                  <AdminSection
                    event={event.data}
                    refetchEvent={event.refetch}
                  />
                </div>
                <div className="col-span-12 lg:col-span-8">
                  <EventView event={event.data} />
                </div>
              </div>
            </Container>
          )}
          {!isMyEvent && event.data && (
            <Container maxSize="sm">
              <EventView event={event.data} />
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
