import {GetServerSidePropsContext} from 'next';
import {createProxySSGHelpers} from '@trpc/react-query/ssg';
import {EventView} from '../../../features/EventView/EventView';
import {Button, Container, LoadingBlock} from 'ui';
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
import {ONE_WEEK_IN_SECONDS} from 'const';
import {Meta} from '../../../components/Meta/Meta';
import {createOGImageEventUrl, stripHTML} from 'utils';
import {AdjustmentsHorizontalIcon} from '@heroicons/react/24/solid';
import {AnimatePresence, motion} from 'framer-motion';

export default function EventPage() {
  useHandleEmailCallbackParam();
  const user = useMyUserQuery();
  const {eventShortId} = useEventId();
  const event = useEventQuery({eventShortId});
  const isMyEvent = useIsMyEvent({eventShortId});

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
          <Container maxSize="sm">
            <EventView event={event.data} />
          </Container>
          <AnimatePresence mode="wait">
            {isMyEvent && (
              <motion.div
                className="flex justify-center sticky bottom-4 my-4"
                initial={{opacity: 0, y: '200%'}}
                animate={{opacity: 1, y: '0%'}}
                exit={{opacity: 0, y: '200%'}}
              >
                <Button
                  iconLeft={<AdjustmentsHorizontalIcon />}
                  as="a"
                  href={`/e/${event.data.shortId}/manage`}
                  size="md"
                  variant="secondary"
                  data-testid="manage-event-button"
                >
                  Manage event
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
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
