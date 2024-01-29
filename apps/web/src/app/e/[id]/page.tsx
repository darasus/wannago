import {TRPCClientError} from '@trpc/client';
import {config} from 'config';
import {EventView} from 'features/src/EventView/EventView';
import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {Container} from 'ui';
import {getBaseUrl} from 'utils';

import {api} from '../../../trpc/server-http';

import {EventVisibilityCodeForm} from './features/EventVisibilityCodeForm/EventVisibilityCodeForm';
import {ManageEventButton} from './features/ManageEventButton/ManageEventButton';

interface Params {
  params: {id: string};
  searchParams: {code?: string};
}

export async function generateMetadata({
  params: {id},
  searchParams,
}: Params): Promise<Metadata> {
  const event = await api.event.getByShortId
    .query({id, code: searchParams.code})
    .catch(() => null);

  if (!event) {
    return {};
  }

  const url = new URL(`${getBaseUrl()}/api/og-image`);

  url.searchParams.append('title', event.title);
  url.searchParams.append('organizerName', config.name);

  if (event?.featuredImageSrc) {
    url.searchParams.append(
      'eventImageUrl',
      btoa(encodeURIComponent(event?.featuredImageSrc))
    );
  }

  const profileImageSrc = null;

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
    const [me, event] = await Promise.all([
      api.user.me.query(),
      api.event.getByShortId.query({id, code}),
    ]);

    return {me, event, notAllowed: false};
  } catch (error) {
    if (
      error instanceof TRPCClientError &&
      error.shape.data.code === 'FORBIDDEN'
    ) {
      return {me: null, event: null, notAllowed: true};
    }
    return {me: null, event: null, notAllowed: false};
  }
}

export default async function EventPage(props: Params) {
  const {me, event, notAllowed} = await getData(
    props.params.id,
    props.searchParams.code
  );

  if (notAllowed === true) {
    return <EventVisibilityCodeForm id={props.params.id} />;
  }

  if (!event) {
    notFound();
  }

  return (
    <Container className="flex flex-col gap-4" maxSize="sm">
      {event.isMyEvent && <ManageEventButton event={event} />}
      <EventView event={event} isMyEvent={event.isMyEvent} me={me} />
    </Container>
  );
}
