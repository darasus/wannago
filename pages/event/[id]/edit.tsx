import Head from 'next/head';
import {useRouter} from 'next/router';
import AppLayout from '../../../components/AppLayout/AppLayout';
import {EditEventForm} from '../../../components/EventForm/EditEventForm';
import {trpc} from '../../../utils/trpc';

export default function EventEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const {data} = trpc.event.getEventById.useQuery(
    {
      id,
    },
    {
      enabled: !!id,
    }
  );

  if (!data) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`Edit event | WannaGo`}</title>
      </Head>
      <AppLayout>
        <EditEventForm event={data} />
      </AppLayout>
    </>
  );
}
