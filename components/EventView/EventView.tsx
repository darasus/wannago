import {Event} from '@prisma/client';
import {getBaseUrl} from '../../lib/api';
import {DateCard} from '../DateCard/DateCard';
import {InfoCard} from '../InfoCard/InfoCard';
import {LocationCard} from '../LocationCard/LocationCard';
import {ParticipantsCard} from '../ParticipantsCard/ParticipantsCard';

interface Props {
  event: Event;
  myEvent: boolean;
}

export function EventView({event, myEvent}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="mb-4">
          <InfoCard
            eventId={event.id}
            showManageTools={myEvent}
            title={event.title}
            description={event.description}
          />
        </div>
      </div>
      <div>
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
        <div>{`${getBaseUrl()}/e/${event.shortId}`}</div>
      </div>
    </div>
  );
}
