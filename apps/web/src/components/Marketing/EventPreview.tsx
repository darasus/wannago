import {AnimateRender} from './AnimateRender';

import {EventView} from '../../features/EventView/EventView';
import {RouterOutputs} from 'api';

interface Props {
  event: RouterOutputs['event']['getRandomExample'];
}

export default function EventPreview({event}: Props) {
  return (
    <AnimateRender>
      <EventView event={event} me={null} />
    </AnimateRender>
  );
}
