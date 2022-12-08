import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useMemo} from 'react';
import {EventView} from '../../components/EventView/EventView';
import {Container} from '../../components/Marketing/Container';
import {PublicEventBranding} from '../../components/PublicEventBranding/PublicEventBranding';
import {trpc} from '../../utils/trpc';
import ms from 'ms';

export default function EventPage({
  timezone,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const {data} = trpc.event.getEventByNanoId.useQuery(
    {
      id: router.query.id as string,
    },
    {
      trpc: {
        ssr: true,
      },
    }
  );
  const clientTimezone = useMemo(
    () => timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    [timezone]
  );

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
      <Head>
        <title>{`${data.title} | WannaGo`}</title>
      </Head>
      <Container className="md:px-4">
        <EventView event={data} timezone={clientTimezone} />
      </Container>
      <PublicEventBranding />
    </div>
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const timezone = req.headers['x-vercel-ip-timezone'] as string | undefined;

  res.setHeader(
    'Cache-Control',
    `s-maxage=${ms('1m')}, stale-while-revalidate=${ms('7 days')}`
  );

  return {
    props: {timezone: timezone || null},
  };
}
