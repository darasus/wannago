import {auth} from '@clerk/nextjs/app-beta';
import {notFound} from 'next/navigation';
import {DateCard} from '../../../components/DateCard/DateCard';
import {InfoCard} from '../../../components/InfoCard/InfoCard';
import {LocationCard} from '../../../components/LocationCard/LocationCard';
import {ManageEventBar} from '../../../components/ManageEventBar/ManageEventBar';
import {ParticipantsCard} from '../../../components/ParticipantsCard/ParticipantsCard';
import {prisma} from '../../../lib/prisma';

export default async function EventPage({params}: any) {
  const {userId} = auth();
  const event = await prisma.event.findFirst({where: {id: params.id}});

  if (!event) {
    notFound();
  }

  return (
    <>
      {event.authorId === userId && (
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
