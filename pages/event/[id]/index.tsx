import {getAuth} from '@clerk/nextjs/server';
import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next';
import {NextParsedUrlQuery} from 'next/dist/server/request-meta';
import {NextRequest} from 'next/server';
import AppLayout from '../../../components/AppLayout/AppLayout';
import {EventView} from '../../../components/EventView/EventView';
import {api} from '../../../lib/api';

export default function EventPage({
  event,
  myEvent,
  timezone,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AppLayout>
      <EventView
        event={event}
        myEvent={myEvent}
        showManageTools={true}
        timezone={timezone}
      />
    </AppLayout>
  );
}

export async function getServerSideProps({
  req,
  res,
  query,
}: GetServerSidePropsContext) {
  const timezone = req.headers['x-vercel-ip-timezone'] as string | undefined;
  const {userId} = getAuth(req);
  const event = await api.getEvent(query.id as string);

  if (!event) {
    return {notFound: true};
  }

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59');

  return {
    props: {event, myEvent: event.authorId === userId, timezone},
  };
}
