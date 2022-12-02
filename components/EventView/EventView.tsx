import {Event} from '@prisma/client';
import {getBaseUrl} from '../../utils/getBaseUrl';
import {DateCard} from '../Card/DateCard/DateCard';
import {EventUrlCard} from '../Card/EventUrlCard/EventUrlCard';
import {InfoCard} from '../Card/InfoCard/InfoCard';
import {LocationCard} from '../Card/LocationCard/LocationCard';
import {ParticipantsCard} from '../Card/ParticipantsCard/ParticipantsCard';

interface Props {
  event: Event;
  myEvent: boolean;
  timezone?: string;
  isPublicView?: boolean;
}

export function EventView({event, myEvent, isPublicView, timezone}: Props) {
  return (
    <div className="grid md:grid-cols-12 gap-4">
      <div className="md:col-span-8">
        <div className="mb-4">
          <InfoCard
            eventId={event.id}
            showManageTools={!isPublicView && myEvent}
            title={event.title}
            description={event.description}
            featuredImageSrc={event.featuredImageSrc}
          />
        </div>
        <div>
          <LocationCard
            address={event.address}
            longitude={event.longitude!}
            latitude={event.latitude!}
          />
        </div>
      </div>
      <div className="md:col-span-4">
        <div className="mb-4">
          <DateCard event={event} timezone={timezone} />
        </div>
        <div className="mb-4">
          <ParticipantsCard event={event} />
        </div>
        <div>
          <EventUrlCard url={`${getBaseUrl()}/e/${event.shortId}`} />
        </div>
      </div>
    </div>
  );
}
