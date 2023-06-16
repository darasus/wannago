import {trpc} from 'trpc/src/trpc';
import {AnimateRender} from './AnimateRender';

import {EventView} from '../../features/EventView/EventView';
import {LoadingBlock} from 'ui';

export default function EventPreview() {
  const {data: event, isInitialLoading} =
    trpc.event.getRandomExample.useQuery();

  if (!event || isInitialLoading) {
    return <LoadingBlock />;
  }

  return (
    <AnimateRender>
      <EventView event={event} />
    </AnimateRender>
  );
}
