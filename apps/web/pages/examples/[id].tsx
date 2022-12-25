import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next';
import {useRouter} from 'next/router';
import {useMemo} from 'react';
import AppLayout from '../../components/AppLayout/AppLayout';
import {Container} from '../../components/Container/Container';
import {EventView} from '../../components/EventView/EventView';
import {Meta} from '../../components/Meta/Meta';
import {Spinner} from '../../components/Spinner/Spinner';
import {stripHTML} from '../../utils/stripHTML';
import {trpc} from '../../utils/trpc';

export default function EventPage({
  timezone,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const {data, isLoading} = trpc.event.getById.useQuery({
    eventId: router.query.id as string,
  });
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

  if (!data.isPublished) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Event is not found 🫣</h1>
      </div>
    );
  }

  return (
    <div>
      <Meta
        title={data.title}
        description={stripHTML(data.description).slice(0, 100)}
        imageSrc={`/api/og-image?eventId=${data.id}`}
        shortEventId={data.shortId!}
      />
      <AppLayout>
        <Container className="md:px-4">
          <EventView event={data} timezone={clientTimezone} isPublic />
        </Container>
      </AppLayout>
    </div>
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext<{id: string}>) {
  const timezone = req.headers['x-vercel-ip-timezone'] as string | undefined;

  const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
  res.setHeader(
    'Cache-Control',
    `s-maxage=60, stale-while-revalidate=${ONE_WEEK_IN_SECONDS}`
  );

  return {
    props: {timezone: timezone || null},
  };
}
