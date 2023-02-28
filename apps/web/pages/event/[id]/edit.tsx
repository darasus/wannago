import Head from 'next/head';
import {useRouter} from 'next/router';
import AppLayout from '../../../components/AppLayout/AppLayout';
import {EditEventForm} from '../../../features/EventForm/EditEventForm';
import {Container} from 'ui';
import {trpc} from 'trpc/src/trpc';
import {withProtected} from '../../../utils/withAuthProtect';

function EventEditPage() {
  const router = useRouter();
  const eventId = router.query.id as string;
  const {data} = trpc.event.getById.useQuery(
    {
      eventId,
    },
    {
      enabled: !!eventId,
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
      <AppLayout maxSize="lg">
        <Container maxSize="lg">
          <EditEventForm event={data} />
        </Container>
      </AppLayout>
    </>
  );
}

export default withProtected(EventEditPage);
