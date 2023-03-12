import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next';
import Head from 'next/head';
import {useMemo} from 'react';
import {AdminSection} from '../../../features/AdminSection/AdminSection';
import {EventView} from '../../../features/EventView/EventView';
import {Container, Spinner} from 'ui';
import {trpc} from 'trpc/src/trpc';
import {useEventId, useHandleEmailCallbackParam} from 'hooks';

function InternalEventPage({
  timezone,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useHandleEmailCallbackParam();
  const me = trpc.me.me.useQuery();
  const eventId = useEventId();
  const {
    data: event,
    refetch,
    isLoading,
  } = trpc.event.getByShortId.useQuery(
    {
      id: eventId,
    },
    {enabled: !!eventId}
  );
  const isMyEvent = event?.organizationId === me.data?.organizationId;
  const clientTimezone = useMemo(
    () => timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    [timezone]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner />
      </div>
    );
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
                  <AdminSection
                    event={event}
                    timezone={timezone}
                    refetchEvent={refetch}
                  />
                </div>
                <div className="col-span-12 lg:col-span-8">
                  <EventView event={event} timezone={clientTimezone} />
                </div>
              </div>
            </Container>
          )}
          {!isMyEvent && (
            <Container maxSize="sm">
              <EventView event={event} timezone={clientTimezone} />
            </Container>
          )}
        </>
      )}
    </>
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const timezone = req.headers['x-vercel-ip-timezone'] as string | undefined;

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59');

  return {
    props: {timezone: timezone || null},
  };
}

export default InternalEventPage;
