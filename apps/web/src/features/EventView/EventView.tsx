import {Event} from '@prisma/client';
import {getBaseUrl} from 'utils';
import {DateCard} from '../DateCard/DateCard';
import {EventUrlCard} from '../EventUrlCard/EventUrlCard';
import {EventWannaGoArea} from '../EventWannaGoArea/EventWannaGoArea';
import {InfoCard} from 'cards';
import {LocationCard} from '../LocationCard/LocationCard';
import {OrganizerCard} from '../OrganizerCard/OrganizerCard';
import {ParticipantsCard} from '../ParticipantsCard/ParticipantsCard';
import {isPast} from 'utils';
import {StreamCard} from '../StreamCard/StreamCard';

interface Props {
  event: Event;
  timezone?: string;
  isPublic?: boolean;
  relativeTimeString?: string;
}

export function EventView({
  event,
  timezone,
  isPublic,
  relativeTimeString,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-full">
          <OrganizerCard event={event} />
        </div>
        <div className="h-full">
          <EventUrlCard
            url={`${getBaseUrl()}/e/${event.shortId}`}
            eventId={event.id}
            isPublished={event.isPublished ?? false}
          />
        </div>
      </div>
      <div>
        <InfoCard event={event} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-full">
          {event.address && (
            <LocationCard
              address={event.address}
              longitude={event.longitude!}
              latitude={event.latitude!}
              eventId={event.id}
            />
          )}
          {event.streamUrl && (
            <StreamCard eventId={event.id} streamUrl={event.streamUrl} />
          )}
        </div>
        <div className="h-full">
          <DateCard
            event={event}
            timezone={timezone}
            relativeTimeString={relativeTimeString}
          />
        </div>
      </div>
      {!isPast(event.endDate, timezone) && (
        <div className="h-full">
          <ParticipantsCard event={event} />
        </div>
      )}
      {isPublic && (
        <div className="h-full">
          <EventWannaGoArea eventId={event.id} />
        </div>
      )}
    </div>
  );
}
