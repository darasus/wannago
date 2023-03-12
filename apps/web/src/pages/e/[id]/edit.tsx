import Head from 'next/head';
import {useRouter} from 'next/router';
import {EditEventForm} from '../../../features/EventForm/EditEventForm';
import {Container, Spinner} from 'ui';
import {trpc} from 'trpc/src/trpc';
import {withProtected} from '../../../utils/withAuthProtect';

function EventEditPage() {
  const router = useRouter();
  const shortId = router.query.id as string;
  const {data: event, isLoading} = trpc.event.getByShortId.useQuery(
    {
      id: shortId,
    },
    {
      enabled: !!shortId,
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`Edit event | WannaGo`}</title>
      </Head>
      {event && (
        <Container>
          <EditEventForm event={event} />
        </Container>
      )}
    </>
  );
}

export default withProtected(EventEditPage);
