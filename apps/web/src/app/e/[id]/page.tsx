import {Container} from 'ui';
import {api} from '../../../trpc/server-http';
import {ManageEventButton} from './features/ManageEventButton/ManageEventButton';
import {EventView} from '../../../features/EventView/EventView';
import {getBaseUrl} from 'utils';
import {notFound} from 'next/navigation';

export const runtime = 'edge';
export const preferredRegion = 'iad1';

export async function generateMetadata({params: {id}}: {params: {id: string}}) {
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
    openGraph: {
      images: [url.toString()],
    },
  };
}

export default async function EventPage({
  params: {id},
}: {
  params: {id: string};
}) {
  const [me, isMyEvent, event] = await Promise.all([
    api.user.me.query(),
    api.event.getIsMyEvent.query({
      eventShortId: id,
    }),
    api.event.getByShortId.query({id}),
  ]);

  if (!event) {
    notFound();
  }

  if (event.isPublished === false && isMyEvent === false) {
    notFound();
  }

  return (
    <Container className="flex flex-col gap-4" maxSize="sm">
      {isMyEvent && <ManageEventButton event={event} />}
      <EventView event={event} isMyEvent={isMyEvent} me={me} />
    </Container>
  );
}
