import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useMemo} from 'react';
import {AdminSection} from '../../../features/AdminSection/AdminSection';
import AppLayout from '../../../components/AppLayout/AppLayout';
import {EventView} from '../../../components/EventView/EventView';
import {Container} from 'ui';
import {trpc} from '../../../utils/trpc';
import {Spinner} from '../../../components/Spinner/Spinner';
import {withProtected} from '../../../utils/withAuthProtect';

function InternalEventPage({
  timezone,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const eventId = router.query.id as string;
  const {data, refetch, isLoading} = trpc.event.getById.useQuery(
    {
      eventId,
    },
    {enabled: !!eventId}
  );
  const clientTimezone = useMemo(
    () => timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    [timezone]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`${data.title} | WannaGo`}</title>
      </Head>
      <AppLayout maxSize="lg">
        <Container maxSize="lg">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-3">
              <AdminSection
                event={data}
                timezone={timezone}
                refetchEvent={refetch}
              />
            </div>
            <div className="col-span-12 lg:col-span-9">
              <EventView event={data} timezone={clientTimezone} />
            </div>
          </div>
        </Container>
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const timezone = req.headers['x-vercel-ip-timezone'] as string | undefined;

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59');

  return {
    props: {timezone: timezone || null},
  };
}

export default withProtected(InternalEventPage);
