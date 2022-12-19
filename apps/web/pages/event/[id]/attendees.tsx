import {TrashIcon} from '@heroicons/react/24/solid';
import {User} from '@prisma/client';
import Head from 'next/head';
import {useRouter} from 'next/router';
import AppLayout from '../../../components/AppLayout/AppLayout';
import {Button} from '../../../components/Button/Button';
import {CardBase} from '../../../components/Card/CardBase/CardBase';
import {Container} from '../../../components/Container/Container';
import {Text} from '../../../components/Text/Text';
import {trpc} from '../../../utils/trpc';
import {saveAs} from 'file-saver';

interface ItemProps {
  user: User;
  eventId: string;
  refetch: () => void;
}

function Item({user, refetch, eventId}: ItemProps) {
  const removeUser = trpc.event.removeUser.useMutation({
    onSuccess() {
      refetch();
    },
  });

  return (
    <CardBase key={user.id} className="flex items-center mb-2">
      <Text>{`${user.firstName} ${user.lastName} - ${user.email}`}</Text>
      <div className="grow" />
      <Button
        isLoading={removeUser.isLoading}
        onClick={() => {
          removeUser.mutate({
            eventId,
            userId: user.id,
          });
        }}
        iconLeft={<TrashIcon className="h-5 w-5" />}
        variant="danger"
      />
    </CardBase>
  );
}

export default function EventEditPage() {
  const router = useRouter();
  const eventId = router.query.id as string;
  const {data, refetch} = trpc.event.getAttendees.useQuery(
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );

  const handleDownloadCsvClick = () => {
    const content =
      'First name,Last name,Email\r\n' +
      data
        ?.map(user => {
          return `${user.firstName},${user.lastName},${user.email}`;
        })
        .join('\r\n')!;
    const blob = new Blob([content], {type: 'text/csv;charset=utf-8'});
    saveAs(blob, 'file.csv');
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`Attendees | WannaGo`}</title>
      </Head>
      <AppLayout>
        <Container className="md:px-4">
          <div className="flex justify-end mb-4">
            <Button variant="neutral" onClick={handleDownloadCsvClick}>
              Export CSV
            </Button>
          </div>
          {data.length === 0 && (
            <div className="text-center">
              <Text>No attendees yet</Text>
            </div>
          )}
          {data?.map(user => {
            return (
              <Item
                key={user.id}
                user={user}
                eventId={eventId}
                refetch={refetch}
              />
            );
          })}
        </Container>
      </AppLayout>
    </>
  );
}
