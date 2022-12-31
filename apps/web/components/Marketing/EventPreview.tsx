import {useRef, useState, useLayoutEffect} from 'react';
import {getBaseUrl} from '../../utils/getBaseUrl';
import {trpc} from '../../utils/trpc';
import {DateCard} from '../Card/DateCard/DateCard';
import {EventUrlCard} from '../Card/EventUrlCard/EventUrlCard';
import {InfoCard} from '../Card/InfoCard/InfoCard';
import {LocationCard} from '../Card/LocationCard/LocationCard';
import {OrganizerCardView} from '../Card/OrganizerCard/OrganizerCardView';
import {ParticipantsCard} from '../Card/ParticipantsCard/ParticipantsCard';
import {AnimateRender} from './AnimateRender';

function Event() {
  const {data: event} = trpc.event.getRandomExample.useQuery();

  if (!event) return null;
  if (!event.organization?.users[0]) return null;

  const elements = [
    <InfoCard key={1} event={event} />,
    <LocationCard
      key={2}
      address={event.address}
      longitude={event.longitude!}
      latitude={event.latitude!}
    />,
    <OrganizerCardView
      key={3}
      user={event.organization?.users[0]}
      isLoading={false}
      onOpenFormClick={() => {}}
    />,
    <DateCard key={4} event={event} timezone={undefined} />,
    <ParticipantsCard key={5} event={event} fake />,
    <EventUrlCard key={6} url={`${getBaseUrl()}/e/${event.shortId}`} />,
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="flex flex-col col-span-8 gap-y-4">
        {elements.slice(0, 1).map((el, i) => {
          return (
            <AnimateRender key={i}>
              <div>{el}</div>
            </AnimateRender>
          );
        })}
      </div>
      <div className="flex flex-col col-span-4 gap-y-4">
        {elements.slice(2, 7).map((el, i) => {
          return (
            <AnimateRender key={i} delay={(i + 1) / 2}>
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
