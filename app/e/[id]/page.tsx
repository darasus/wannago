import {EventView} from '../../../components/EventView/EventView';
import {api} from '../../../lib/api';
import {headers} from 'next/headers';

export const runtime = 'experimental-edge';

export default async function PublicEventPage({params}: any) {
  const headersList = headers();
  const timezone = headersList.get('x-vercel-ip-timezone') || undefined;
  const event = await api.getEventByNanoId(params.id);

  if (!event) {
    return null;
  }

  return (
    <div className="max-w-xl m-auto">
      <EventView
        event={event}
        myEvent={false}
        showManageTools={false}
        timezone={timezone}
      />
    </div>
  );
}
