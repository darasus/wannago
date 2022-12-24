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
  isPublic?: boolean;
}

export function EventView({event, timezone, isPublic}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="flex flex-col gap-y-4 md:col-span-8">
        <div>
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
      <div className="flex flex-col gap-y-4 md:col-span-4">
        <div>
          <OrganizerCard event={event} />
        </div>
        <div>
          <DateCard event={event} timezone={timezone} />
        </div>
        <div>
          <ParticipantsCard event={event} />
        </div>
        <div>
          <EventUrlCard url={`${getBaseUrl()}/e/${event.shortId}`} />
        </div>
        {isPublic && (
          <div>
            <EventWannaGoArea eventId={event.id} />
          </div>
        )}
      </div>
    </div>
  );
}
