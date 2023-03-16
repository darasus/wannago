import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next';
import Head from 'next/head';
import {useMemo} from 'react';
import {AdminSection} from '../../../features/AdminSection/AdminSection';
import {EventView} from '../../../features/EventView/EventView';
import {Container, LoadingBlock, Spinner} from 'ui';
import {trpc} from 'trpc/src/trpc';
import {useEventId, useHandleEmailCallbackParam, useMe} from 'hooks';

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
