import {useRef, useState} from 'react';
import {trpc} from 'trpc/src/trpc';
import {AnimateRender} from './AnimateRender';
import {
  DateCard,
  LocationCard,
  OrganizerCard,
  SignUpCard,
  UrlCard,
} from 'card-features';
import {getBaseUrl} from 'utils';
import {InfoCard} from 'cards';
import {useEventListener, useIsomorphicLayoutEffect} from 'usehooks-ts';

export default function EventPreview() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number | null>(null);
  const canRenderPreview = scale !== null && scale > 0;

  const handleSize = () => {
    const el = ref.current?.getBoundingClientRect();
    const containerWidth = el?.width || 1024;
    const scale = containerWidth / 1024;

    setScale(scale);
  };

  useEventListener('resize', handleSize);

  useIsomorphicLayoutEffect(() => {
    handleSize();
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

function Event() {
  const {data: event} = trpc.event.getRandomExample.useQuery();

  if (!event) return null;

  return (
    <AnimateRender>
      <div className="flex flex-col gap-4">
        <div className="sticky top-4 z-20">
          <SignUpCard event={event} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="items-stretch">
            <OrganizerCard event={event} />
          </div>
          <div className="items-stretch">
            <UrlCard
              url={`${getBaseUrl()}/e/${event.shortId}`}
              eventId={event.id}
              isPublished={event.isPublished ?? false}
            />
          </div>
        </div>
        <div>
          <InfoCard event={event} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="items-stretch">
            <LocationCard
              address={event.address}
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
    </AnimateRender>
  );
}
