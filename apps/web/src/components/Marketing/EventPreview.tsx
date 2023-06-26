import {AnimateRender} from './AnimateRender';

import {EventView} from '../../features/EventView/EventView';
import {use} from 'react';
import {api} from '../../trpc/client';
import {LoadingBlock} from 'ui';

export default function EventPreview() {
  const event = use(api.event.getRandomExample.query());

  if (!event) {
    return <LoadingBlock />;
  }

  return (
    <AnimateRender>
      <EventView event={event} />
    </AnimateRender>
  );
}
