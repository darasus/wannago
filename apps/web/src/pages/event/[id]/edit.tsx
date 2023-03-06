import Head from 'next/head';
import {useRouter} from 'next/router';
import AppLayout from '../../../features/AppLayout/AppLayout';
import {EditEventForm} from '../../../features/EventForm/EditEventForm';
import {Container} from 'ui';
import {trpc} from 'trpc/src/trpc';
import {withProtected} from '../../../utils/withAuthProtect';

function EventEditPage() {
  const router = useRouter();
  const eventId = router.query.id as string;
  const {data: event, isLoading} = trpc.event.getById.useQuery(
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );

  return (
    <>
      <Head>
        <title>{`Edit event | WannaGo`}</title>
      </Head>
      <AppLayout isLoading={isLoading}>
        {event && (
          <Container>
            <EditEventForm event={event} />
          </Container>
        )}
      </AppLayout>
    </>
  );
}

export default withProtected(EventEditPage);
