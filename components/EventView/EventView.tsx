import {Event} from '@prisma/client';
import {getBaseUrl} from '../../utils/getBaseUrl';
import {DateCard} from '../DateCard/DateCard';
import {EventUrlCard} from '../EventUrlCard/EventUrlCard';
import {InfoCard} from '../InfoCard/InfoCard';
import {LocationCard} from '../LocationCard/LocationCard';
import {ParticipantsCard} from '../ParticipantsCard/ParticipantsCard';

interface Props {
  event: Event;
  myEvent: boolean;
  timezone?: string;
  isPublicView?: boolean;
}

export function EventView({event, myEvent, isPublicView, timezone}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <EventUrlCard url={`${getBaseUrl()}/e/${event.shortId}`} />
      </div>
      <div>
        <InfoCard
          eventId={event.id}
          showManageTools={!isPublicView && myEvent}
          title={event.title}
          description={event.description}
          featuredImageSrc={event.featuredImageSrc}
        />
      </div>
      <div>
        <DateCard event={event} timezone={timezone} />
      </div>
      <div>
        <LocationCard
          address={event.address}
          longitude={event.longitude!}
          latitude={event.latitude!}
        />
      </div>
      <div>
        <ParticipantsCard event={event} />
      </div>
    </div>
  );
}
