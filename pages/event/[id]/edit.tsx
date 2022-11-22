import {InferGetServerSidePropsType} from 'next';
import {NextParsedUrlQuery} from 'next/dist/server/request-meta';
import {NextRequest} from 'next/server';
import {EditEventForm} from '../../../components/EventForm/EditEventForm';
import {api} from '../../../lib/api';

export default function EventEditPage({
  event,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <EditEventForm event={event} />;
}

export async function getServerSideProps({
  query,
}: {
  req: NextRequest;
  query: NextParsedUrlQuery;
}) {
  const event = await api.getEvent(query.id as string);

  if (!event) {
    return {notFound: true};
  }

  return {props: {event}};
}
