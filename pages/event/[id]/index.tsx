import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useMemo} from 'react';
import {AdminSection} from '../../../components/AdminSection/AdminSection';
import AppLayout from '../../../components/AppLayout/AppLayout';
import {EventView} from '../../../components/EventView/EventView';
import {Container} from '../../../components/Container/Container';
import {trpc} from '../../../utils/trpc';
import {Spinner} from '../../../components/Spinner/Spinner';

export default function EventPage({
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
      <AppLayout>
        <Container className="md:px-4">
          <div className="mb-4">
            <AdminSection
              event={data}
              timezone={timezone}
              refetchEvent={refetch}
            />
          </div>
          <EventView event={data} timezone={clientTimezone} />
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
