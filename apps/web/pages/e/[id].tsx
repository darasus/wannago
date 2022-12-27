import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next';
import {useRouter} from 'next/router';
import {useMemo} from 'react';
import {EventView} from '../../components/EventView/EventView';
import {Container} from '../../components/Container/Container';
import {trpc} from '../../utils/trpc';
import {Meta} from '../../components/Meta/Meta';
import {stripHTML} from '../../utils/stripHTML';
import {Spinner} from '../../components/Spinner/Spinner';
import {createProxySSGHelpers} from '@trpc/react-query/ssg';
import {appRouter} from '../../server/routers/_app';
import {createContext} from '../../server/context';
import SuperJSON from 'superjson';

function PublicEventPage({
  timezone,
  event,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const {data, isLoading} = trpc.event.getByShortId.useQuery(
    {
      id: router.query.id as string,
    },
    {
      initialData: SuperJSON.parse(event),
    }
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

  if (!data.isPublished) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Page not found 🫣</h1>
      </div>
    );
  }

  return (
    <div>
      <Meta
        title={data.title}
        description={`${stripHTML(data.description).slice(0, 100)}...`}
        imageSrc={`/api/og-image?eventId=${data.id}`}
        shortEventId={data.shortId!}
      />
      <Container className="md:px-4">
        <EventView event={data} timezone={clientTimezone} isPublic />
      </Container>
    </div>
  );
}

export async function getServerSideProps({
  req,
  res,
  params,
}: GetServerSidePropsContext<{id: string}>) {
  const timezone = req.headers['x-vercel-ip-timezone'] as string | undefined;

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: SuperJSON,
  });

  const event = await ssg.event.getByShortId.fetch({id: params?.id!});

  const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
  res.setHeader(
    'Cache-Control',
    `s-maxage=60, stale-while-revalidate=${ONE_WEEK_IN_SECONDS}`
  );

  if (!event?.isPublished) {
    return {
      notFound: true,
    };
  }

  return {
    props: {timezone: timezone || null, event: SuperJSON.stringify(event)},
  };
}

export default PublicEventPage;
