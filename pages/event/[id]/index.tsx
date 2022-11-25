import {InferGetServerSidePropsType} from 'next';
import {NextParsedUrlQuery} from 'next/dist/server/request-meta';
import {NextRequest} from 'next/server';
import AppLayout from '../../../components/AppLayout/AppLayout';
import {EventView} from '../../../components/EventView/EventView';
import {api} from '../../../lib/api';

export default function EventPage({
  event,
  myEvent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AppLayout>
      <EventView event={event} myEvent={myEvent} showManageTools={true} />
    </AppLayout>
  );
}

export async function getServerSideProps({
  req,
  query,
}: {
  req: NextRequest;
  query: NextParsedUrlQuery;
}) {
  const event = await api.getEvent(query.id as string);
  const requestHeaders = new Headers(req.headers);
  const userId = requestHeaders.get('x-user-id');

  if (!event) {
    return {notFound: true};
  }

  return {
    props: {event, myEvent: event.authorId === userId},
  };
}
