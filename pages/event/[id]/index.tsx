import {getAuth} from '@clerk/nextjs/server';
import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next';
import {DateCard} from '../../../components/DateCard/DateCard';
import {InfoCard} from '../../../components/InfoCard/InfoCard';
import {LocationCard} from '../../../components/LocationCard/LocationCard';
import {ManageEventBar} from '../../../components/ManageEventBar/ManageEventBar';
import {ParticipantsCard} from '../../../components/ParticipantsCard/ParticipantsCard';
import {api} from '../../../lib/api';

export default function EventPage({
  event,
  myEvent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      {myEvent && (
        <div className="mb-4">
          <ManageEventBar id={event.id} />
        </div>
      )}
      <div className="mb-4">
        <InfoCard title={event.title} description={event.description} />
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
    </>
  );
}

export async function getServerSideProps({
  query,
  req,
}: GetServerSidePropsContext) {
  req.headers.host;
  const event = await api.getEvent(query.id as string);
  const {userId} = getAuth(req);

  if (!event) {
    return {notFound: true};
  }

  return {props: {event, myEvent: event.authorId === userId}};
}
