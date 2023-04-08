import {GetServerSidePropsContext} from 'next';
import {createProxySSGHelpers} from '@trpc/react-query/ssg';
import {EventInfo} from './features/EventInfo/EventInfo';
import {Button, Container, LoadingBlock, Menu, PageHeader, Text} from 'ui';
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
import {useRouter} from 'next/router';
import {EditEventForm} from '../../../features/EventForm/EditEventForm';
import {EventAttendees} from './features/EventAttendees/EventAttendees';
import {EventInvite} from './features/EventInvite/EventInvite';
import {ArrowLeftCircleIcon} from '@heroicons/react/24/solid';

export default function EventPage() {
  const router = useRouter();
  const page =
    typeof router.query.page === 'undefined' ? 'event' : router.query.page[0];
  useHandleEmailCallbackParam();
  const user = useMyUserQuery();
  const {eventShortId} = useEventId();
  const event = useEventQuery({eventShortId});
  const isMyEvent = useIsMyEvent({eventShortId});

  if (event.isLoading) {
    return <LoadingBlock />;
  }

  if (!isMyEvent || !event.data) return null;

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
            <div className="flex flex-col gap-4">
              <Button
                variant="neutral"
                iconLeft={<ArrowLeftCircleIcon />}
                href={`/e/${event.data.shortId}`}
                as="a"
                data-testid="back-to-event-button"
              >
                <Text truncate>{`Back to "${event.data.title}"`}</Text>
              </Button>
              <PageHeader title="Manage event">
                <Menu
                  testId="manage-event-menu"
                  size="sm"
                  activeHref={router.asPath}
                  options={[
                    {
                      label: 'Event overview',
                      href: `/e/${event.data.shortId}/manage`,
                    },
                    {
                      label: 'Edit event',
                      href: `/e/${event.data.shortId}/edit`,
                    },
                    {
                      label: 'Attendees',
                      href: `/e/${event.data.shortId}/attendees`,
                    },
                    {
                      label: 'Invite',
                      href: `/e/${event.data.shortId}/invite`,
                    },
                  ]}
                />
              </PageHeader>
              <div>
                {page === 'manage' && <EventInfo />}
                {page === 'edit' && <EditEventForm />}
                {page === 'attendees' && <EventAttendees />}
                {page === 'invite' && <EventInvite />}
              </div>
            </div>
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
