import {RouterOutputs} from 'api';
import {getBaseUrl} from 'utils';

import {DateCard} from '../DateCard/DateCard';
import {InfoCard} from '../InfoCard/InfoCard';
import {LocationCard} from '../LocationCard/LocationCard';
import {OrganizerCard} from '../OrganizerCard/OrganizerCard';
import {SignUpCard} from '../SignUpCard/SignUpCard';
import {UrlCard} from '../UrlCard/UrlCard';

interface Props {
  event: RouterOutputs['event']['getByShortId'];
  isLoadingImage?: boolean;
  isMyEvent?: boolean;
  me: RouterOutputs['user']['me'];
}

export async function EventView({event, isLoadingImage, isMyEvent, me}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-4 z-20">
        <SignUpCard event={event} mePromise={Promise.resolve(me)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="items-stretch">
          <OrganizerCard event={event} />
        </div>
        <div className="items-stretch">
          <UrlCard
            url={`${getBaseUrl()}/e/${event.shortId}`}
            eventId={event.id}
          />
        </div>
      </div>
      <div>
        <InfoCard
          event={event}
          isLoadingImage={isLoadingImage}
          isMyEvent={isMyEvent}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="items-stretch">
          <LocationCard
            address={event.address!}
            longitude={event.longitude!}
            latitude={event.latitude!}
            eventId={event.id}
          />
        </div>
        <div className="items-stretch">
          <DateCard event={event} />
        </div>
      </div>
    </div>
  );
}
