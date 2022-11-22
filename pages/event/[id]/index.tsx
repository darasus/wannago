import {InferGetServerSidePropsType} from 'next';
import {NextParsedUrlQuery} from 'next/dist/server/request-meta';
import {NextRequest} from 'next/server';
import AppLayout from '../../../components/AppLayout/AppLayout';
import {DateCard} from '../../../components/DateCard/DateCard';
import {InfoCard} from '../../../components/InfoCard/InfoCard';
import {LocationCard} from '../../../components/LocationCard/LocationCard';
import {ParticipantsCard} from '../../../components/ParticipantsCard/ParticipantsCard';
import {api} from '../../../lib/api';

export default function EventPage({
  event,
  myEvent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AppLayout>
      <div className="mb-4">
        <InfoCard
          eventId={event.id}
          showManageTools={myEvent}
          title={event.title}
          description={event.description}
        />
      </div>
      <div className="mb-4">
        <DateCard
          startDate={new Date(event.startDate)}
          endDate={new Date(event.endDate)}
        />
      </div>
      <div className="mb-4">
        <LocationCard address={event.address} />
      </div>
      <div>
        <ParticipantsCard />
      </div>
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
