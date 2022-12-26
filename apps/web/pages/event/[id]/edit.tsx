import Head from 'next/head';
import {useRouter} from 'next/router';
import AppLayout from '../../../components/AppLayout/AppLayout';
import {EditEventForm} from '../../../components/EventForm/EditEventForm';
import {Container} from '../../../components/Container/Container';
import {trpc} from '../../../utils/trpc';
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
      <AppLayout>
        <Container className="md:px-4">
          <EditEventForm event={data} />
        </Container>
      </AppLayout>
    </>
  );
}

export default withProtected(EventEditPage);
