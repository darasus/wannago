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
      <div className="flex flex-col gap-y-4 md:col-span-8">
        <div>
          <OrganizerCard event={event} />
        </div>
        <div>
          <InfoCard event={event} />
        </div>
        <div>
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
        <div>
          <DateCard
            event={event}
            timezone={timezone}
            relativeTimeString={relativeTimeString}
          />
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
