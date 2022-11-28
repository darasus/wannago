import {useRouter} from 'next/router';
import AppLayout from '../../../components/AppLayout/AppLayout';
import {EditEventForm} from '../../../components/EventForm/EditEventForm';
import {trpc} from '../../../utils/trpc';

export default function EventEditPage() {
  const router = useRouter();
  const {data} = trpc.event.getEventById.useQuery({
    id: router.query.id as string,
  });

  if (!data) {
    return null;
  }

  return (
    <AppLayout>
      <EditEventForm event={data} />
    </AppLayout>
  );
}
