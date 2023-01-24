import {Event} from '@prisma/client';
import {getBaseUrl} from '../../utils/getBaseUrl';
import {DateCard} from '../../features/DateCard/DateCard';
import {EventUrlCard} from '../EventUrlCard/EventUrlCard';
import {EventWannaGoArea} from '../EventWannaGoArea/EventWannaGoArea';
import {InfoCard} from '../InfoCard/InfoCard';
import {LocationCard} from '../../features/LocationCard/LocationCard';
import {OrganizerCard} from '../../features/OrganizerCard/OrganizerCard';
import {ParticipantsCard} from '../../features/ParticipantsCard/ParticipantsCard';
import {isPast} from '../../utils/formatDate';

interface Props {
  event: Event;
  timezone?: string;
  isPublic?: boolean;
}

export function EventView({event, timezone, isPublic}: Props) {
  const organizer = <OrganizerCard event={event} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="flex flex-col gap-y-4 md:col-span-8">
        <div className="block md:hidden">{organizer}</div>
        <div>
          <InfoCard
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
            eventId={event.id}
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-4 md:col-span-4">
        <div className="hidden md:block">{organizer}</div>
        <div>
          <DateCard event={event} timezone={timezone} />
        </div>
        {!isPast(event.endDate, timezone) && (
          <div>
            <ParticipantsCard event={event} />
          </div>
        )}
        <div>
          <EventUrlCard
            url={`${getBaseUrl()}/e/${event.shortId}`}
            eventId={event.id}
            isPublished={event.isPublished ?? false}
          />
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
