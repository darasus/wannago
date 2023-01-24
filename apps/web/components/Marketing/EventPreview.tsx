import {useRef, useState, useLayoutEffect} from 'react';
import {getBaseUrl} from '../../utils/getBaseUrl';
import {MockFormProvider} from '../../utils/MockFormProvider';
import {trpc} from '../../utils/trpc';
import {DateCard} from '../DateCard/DateCard';
import {EventUrlCard} from '../EventUrlCard/EventUrlCard';
import {InfoCard} from '../InfoCard/InfoCard';
import {LocationCard} from '../LocationCard/LocationCard';
import {OrganizerCard as OrganizerCardView} from '../OrganizerCard/OrganizerCard';
import {ParticipantsCard} from '../ParticipantsCard/ParticipantsCard';
import {AnimateRender} from './AnimateRender';

function Event() {
  const {data: event} = trpc.event.getRandomExample.useQuery();

  if (!event) return null;
  if (!event.organization?.users[0]) return null;

  const elements = [
    {
      el: (
        <InfoCard
          key={1}
          title={event.title}
          description={event.description}
          featuredImageSrc={event.featuredImageSrc}
        />
      ),
      delay: 0,
    },
    {
      el: (
        <LocationCard
          address={event.address}
          longitude={event.longitude!}
          latitude={event.latitude!}
          onGetDirectionsClick={() => {}}
        />
      ),
      delay: 1,
    },
    {
      el: (
        <MockFormProvider>
          <OrganizerCardView
            user={event.organization?.users[0]}
            isLoading={false}
            onOpenFormClick={() => {}}
          />
        </MockFormProvider>
      ),
      delay: 2,
    },
    {
      el: (
        <DateCard
          endDate={event.endDate}
          startDate={event.startDate}
          timezone={undefined}
          onAddToCalendarClick={() => {}}
        />
      ),
      delay: 3,
    },
    {
      el: (
        <MockFormProvider>
          <ParticipantsCard
            numberOfAttendees={'31 people attending'}
            onSubmit={() => {}}
          />
        </MockFormProvider>
      ),
      delay: 4,
    },
    {
      el: (
        <EventUrlCard
          url={`${getBaseUrl()}/e/${event.shortId}`}
          eventId={''}
          isPublished={true}
        />
      ),
      delay: 5,
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="flex flex-col col-span-8 gap-y-4">
        {elements.slice(0, 2).map(({el, delay}, i) => {
          return (
            <AnimateRender key={i} delay={(delay + 1) / 2}>
              <div>{el}</div>
            </AnimateRender>
          );
        })}
      </div>
      <div className="flex flex-col col-span-4 gap-y-4">
        {elements.slice(2, 7).map(({el, delay}, i) => {
          return (
            <AnimateRender key={i} delay={(delay + 1) / 2}>
              <div>{el}</div>
            </AnimateRender>
          );
        })}
      </div>
    </div>
  );
}

export default function EventPreview() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number | null>(null);
  const canRenderPreview = scale !== null && scale > 0;

  useLayoutEffect(() => {
    const el = ref.current?.getBoundingClientRect();
    const containerWidth = el?.width || 1024;
    const scale = containerWidth / 1024;

    setScale(scale);
  }, []);

  return (
    <div ref={ref} className="h-full w-full">
      <div
        style={{
          minWidth: 1024,
          scale: `${scale}`,
          transformOrigin: 'top left',
        }}
      >
        {canRenderPreview && <Event />}
      </div>
    </div>
  );
}
