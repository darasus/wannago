import {Event} from '@prisma/client';
import {getBaseUrl} from '../../utils/getBaseUrl';
import {DateCard} from '../Card/DateCard/DateCard';
import {EventUrlCard} from '../Card/EventUrlCard/EventUrlCard';
import {EventWannaGoArea} from '../Card/EventWannaGoArea/EventWannaGoArea';
import {InfoCard} from '../Card/InfoCard/InfoCard';
import {LocationCard} from '../Card/LocationCard/LocationCard';
import {OrganizerCard} from '../Card/OrganizerCard/OrganizerCard';
import {ParticipantsCard} from '../Card/ParticipantsCard/ParticipantsCard';

interface Props {
  event: Event;
  timezone?: string;
}

export function EventView({event, timezone}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="md:col-span-8">
        <div className="mb-4">
          <OrganizerCard event={event} />
        </div>
        <div className="mb-4">
          <InfoCard event={event} />
        </div>
        <div>
          <LocationCard
            address={event.address}
            longitude={event.longitude!}
            latitude={event.latitude!}
          />
        </div>
      </div>
      <div className="flex flex-col md:col-span-4 gap-y-4">
        <div>
          <DateCard event={event} timezone={timezone} />
        </div>
        <div>
          <ParticipantsCard event={event} />
        </div>
        <div>
          <EventUrlCard url={`${getBaseUrl()}/e/${event.shortId}`} />
        </div>
        <div>
          <EventWannaGoArea eventId={event.id} />
        </div>
      </div>
    </div>
  );
}
