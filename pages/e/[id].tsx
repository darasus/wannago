import {getAuth} from '@clerk/nextjs/server';
import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next';
import {EventView} from '../../components/EventView/EventView';
import {api} from '../../lib/api';

export default function EventPage({
  event,
  myEvent,
  timezone,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="max-w-xl m-auto py-4">
      <EventView
        event={event}
        myEvent={myEvent}
        showManageTools={true}
        timezone={timezone}
      />
    </div>
  );
}

export async function getServerSideProps({
  req,
  res,
  query,
}: GetServerSidePropsContext) {
  const timezone = req.headers['x-vercel-ip-timezone'] as string | undefined;
  const {userId} = getAuth(req);
  const event = await api.getEventByNanoId(query.id as string);

  if (!event) {
    return {notFound: true};
  }

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59');

  return {
    props: {event, myEvent: event.authorId === userId, timezone},
  };
}
