import {
  DateCard,
  LocationCard,
  OrganizerCard,
  SignUpCard,
  UrlCard,
} from 'card-features';
import {InfoCard} from 'cards';
import {getBaseUrl} from 'utils';
import {api} from '../../trpc/server-http';
import {RouterOutputs} from 'api';

interface Props {
  event:
    | RouterOutputs['event']['getByShortId']
    | RouterOutputs['event']['getRandomExample'];
  isLoadingImage?: boolean;
  isMyEvent?: boolean;
  me: RouterOutputs['user']['me'];
}

export async function EventView({event, isLoadingImage, isMyEvent, me}: Props) {
  const myTicketPromise = api.event.getMyTicketsByEvent.query({
    eventShortId: event.shortId,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-4 z-20">
        <SignUpCard
          event={event}
          myTicketPromise={myTicketPromise}
          mePromise={Promise.resolve(me)}
        />
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
