import {AnimateRender} from './AnimateRender';

import {EventView} from '../../features/EventView/EventView';
import {api} from '../../trpc/client';

interface Props {
  eventPromise: ReturnType<typeof api.event.getRandomExample.query>;
}

export default function EventPreview({eventPromise}: Props) {
  return (
    <AnimateRender>
      <EventView eventPromise={eventPromise} me={null} noSticky />
    </AnimateRender>
  );
}
