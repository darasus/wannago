import {GetServerSidePropsContext} from 'next';
import {createProxySSGHelpers} from '@trpc/react-query/ssg';
import {EventView} from '../../../features/EventView/EventView';
import {Container, LoadingBlock} from 'ui';
import {
  useEventId,
  useEventQuery,
  useHandleEmailCallbackParam,
  useMyUserQuery,
} from 'hooks';
import {appRouter} from 'trpc/src/routers/_app';
import {createContext} from 'trpc';
import SuperJSON from 'superjson';
import {ONE_WEEK_IN_SECONDS} from 'const';
import {Meta} from '../../../components/Meta/Meta';
import {createOGImageEventUrl, stripHTML} from 'utils';
import {ManageEventButton} from './features/ManageEventButton/ManageEventButton';

export default function EventPage() {
  useHandleEmailCallbackParam();
  const user = useMyUserQuery();
  const {eventShortId} = useEventId();
  const event = useEventQuery({eventShortId});

  if (event.isLoading) {
    return <LoadingBlock />;
  }

  if (!event.data) return null;

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
          <Container className="flex flex-col gap-4" maxSize="sm">
            <ManageEventButton />
            <EventView event={event.data} />
          </Container>
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
