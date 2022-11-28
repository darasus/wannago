import {useUser} from '@clerk/nextjs';
import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next';
import {useRouter} from 'next/router';
import {useMemo} from 'react';
import AppLayout from '../../../components/AppLayout/AppLayout';
import {EventView} from '../../../components/EventView/EventView';
import {trpc} from '../../../utils/trpc';

export default function EventPage({
  timezone,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const user = useUser();
  const {data} = trpc.event.getEventById.useQuery({
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
    <AppLayout>
      <EventView
        event={data}
        myEvent={user.user?.id === data.authorId}
        showManageTools={true}
        timezone={clientTimezone}
      />
    </AppLayout>
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
