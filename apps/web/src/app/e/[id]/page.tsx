import {Container} from 'ui';
import {api} from '../../../trpc/server-http';
import {ManageEventButton} from './features/ManageEventButton/ManageEventButton';
import {EventView} from '../../../features/EventView/EventView';
import {getBaseUrl} from 'utils';
import {notFound} from 'next/navigation';
import {Metadata} from 'next';
import {TRPCClientError} from '@trpc/client';
import {EventVisibilityCodeForm} from './features/EventVisibilityCodeForm/EventVisibilityCodeForm';

export const runtime = 'edge';
export const preferredRegion = 'iad1';

interface Params {
  params: {id: string};
  searchParams: {code?: string};
}

export async function generateMetadata({
  params: {id},
}: Params): Promise<Metadata> {
  const event = await api.event.getByShortId.query({id}).catch(() => null);

  if (!event) {
    return {};
  }

  const url = new URL(`${getBaseUrl()}/api/og-image`);

  if (event?.title) {
    url.searchParams.append('title', event?.title);
  }

  url.searchParams.append(
    'organizerName',
    event?.organization?.name ||
      `${event?.user?.firstName} ${event?.user?.lastName}`
  );

  if (event?.featuredImageSrc) {
    url.searchParams.append(
      'eventImageUrl',
      btoa(encodeURIComponent(event?.featuredImageSrc))
    );
  }

  const profileImageSrc =
    event?.organization?.logoSrc || event?.user?.profileImageSrc;

  if (profileImageSrc) {
    url.searchParams.append(
      'organizerProfileImageUrl',
      btoa(encodeURIComponent(profileImageSrc))
    );
  }
  return {
    title: `${event?.title} | WannaGo`,
    description: event?.description?.replaceAll(/<[^>]*>?/gm, ''),
    openGraph: {
      images: [url.toString()],
    },
  };
}

async function getData(id: string, code?: string) {
  'use server';
  try {
    const [me, isMyEvent, event] = await Promise.all([
      api.user.me.query(),
      api.event.getIsMyEvent.query({
        eventShortId: id,
      }),
      api.event.getByShortId.query({id, code}),
    ]);

    return {me, isMyEvent, event, notAllowed: false};
  } catch (error) {
    if (
      error instanceof TRPCClientError &&
      error.shape.data.code === 'FORBIDDEN'
    ) {
      return {me: null, isMyEvent: false, event: null, notAllowed: true};
    }
    return {me: null, isMyEvent: false, event: null, notAllowed: false};
  }
}

export default async function EventPage(props: Params) {
  const {me, isMyEvent, event, notAllowed} = await getData(
    props.params.id,
    props.searchParams.code
  );

  if (!event) {
    notFound();
  }

  if (event.isPublished === false && isMyEvent === false) {
    notFound();
  }

  if (notAllowed === true) {
    return <EventVisibilityCodeForm id={props.params.id} />;
  }

  return (
    <Container className="flex flex-col gap-4" maxSize="sm">
      {isMyEvent && <ManageEventButton event={event} />}
      <EventView event={event} isMyEvent={isMyEvent} me={me} />
    </Container>
  );
}
