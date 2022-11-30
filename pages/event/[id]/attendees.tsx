import Head from 'next/head';
import {useRouter} from 'next/router';
import AppLayout from '../../../components/AppLayout/AppLayout';
import {CardBase} from '../../../components/Card/CardBase/CardBase';
import {Text} from '../../../components/Text/Text';
import {trpc} from '../../../utils/trpc';

export default function EventEditPage() {
  const router = useRouter();
  const eventId = router.query.id as string;
  const {data} = trpc.event.attendees.useQuery(
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
        <title>{`Attendees | WannaGo`}</title>
      </Head>
      <AppLayout>
        {data?.map(v => {
          return (
            <CardBase key={v.id} className="mb-2">
              <Text>{v.email}</Text>
            </CardBase>
          );
        })}
      </AppLayout>
    </>
  );
}
