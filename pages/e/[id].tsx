import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useMemo} from 'react';
import {EventView} from '../../components/EventView/EventView';
import {Container} from '../../components/Marketing/Container';
import {StickyBranding} from '../../components/StickyBranding/StickyBranding';
import {trpc} from '../../utils/trpc';

export default function EventPage({
  timezone,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const {data} = trpc.event.getEventByNanoId.useQuery({
    id: router.query.id as string,
  });
  const clientTimezone = useMemo(
    () => timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    [timezone]
  );

  if (!data) {
    return null;
  }

  return (
    <div>
      <Head>
        <title>{`${data.title} | WannaGo`}</title>
      </Head>
      <Container>
        <EventView
          event={data}
          myEvent={false}
          isPublicView={true}
          timezone={clientTimezone}
        />
      </Container>
      <StickyBranding />
    </div>
  );
}

export async function getServerSideProps({
  req,
  res,
  query,
}: GetServerSidePropsContext) {
  const timezone = req.headers['x-vercel-ip-timezone'] as string | undefined;

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59');

  return {
    props: {timezone: timezone || null},
  };
}
