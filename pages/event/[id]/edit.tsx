import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next';
import AppLayout from '../../../components/AppLayout/AppLayout';
import {EditEventForm} from '../../../components/EventForm/EditEventForm';
import {api} from '../../../lib/api';

export default function EventEditPage({
  event,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AppLayout>
      <EditEventForm event={event} />
    </AppLayout>
  );
}

export async function getServerSideProps({
  query,
  res,
}: GetServerSidePropsContext) {
  const event = await api.getEvent(query.id as string);

  if (!event) {
    return {notFound: true};
  }

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59');

  return {props: {event}};
}
