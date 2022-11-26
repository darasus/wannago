import {Event} from '@prisma/client';
import {getBaseUrl} from '../../lib/api';
import {DateCard} from '../DateCard/DateCard';
import {EventUrlCard} from '../EventUrlCard/EventUrlCard';
import {InfoCard} from '../InfoCard/InfoCard';
import {LocationCard} from '../LocationCard/LocationCard';
import {ParticipantsCard} from '../ParticipantsCard/ParticipantsCard';

interface Props {
  event: Event;
  myEvent: boolean;
  showManageTools?: boolean;
}

export function EventView({event, myEvent, showManageTools}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="mb-4">
          <InfoCard
            eventId={event.id}
            showManageTools={showManageTools && myEvent}
            title={event.title}
            description={event.description}
          />
        </div>
      </div>
      <div>
        <div className="mb-4">
          <DateCard event={event} />
        </div>
        <div className="mb-4">
          <LocationCard address={event.address} />
        </div>
        <div className="mb-4">
          <ParticipantsCard />
        </div>
        <div>
          <EventUrlCard url={`${getBaseUrl()}/e/${event.shortId}`} />
        </div>
      </div>
    </div>
  );
}
