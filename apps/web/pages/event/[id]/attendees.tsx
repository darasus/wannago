import {TrashIcon} from '@heroicons/react/24/solid';
import {EventRegistrationStatus, User} from '@prisma/client';
import Head from 'next/head';
import {useRouter} from 'next/router';
import AppLayout from '../../../components/AppLayout/AppLayout';
import {Button} from '../../../components/Button/Button';
import {CardBase} from '../../../components/CardBase/CardBase';
import {Container} from '../../../components/Container/Container';
import {Text} from '../../../components/Text/Text';
import {trpc} from '../../../utils/trpc';
import {saveAs} from 'file-saver';
import {withProtected} from '../../../utils/withAuthProtect';
import {useConfirmDialog} from '../../../hooks/useConfirmDialog';
import {Badge} from '../../../components/Badge/Badge';
import {EventRegistrationStatusBadge} from '../../../components/EventRegistrationStatusBadge/EventRegistrationStatusBadge';

interface ItemProps {
  user: User;
  status: EventRegistrationStatus;
  eventId: string;
  refetch: () => Promise<any>;
  hasPlusOne: boolean | null;
}

function Item({user, refetch, eventId, hasPlusOne, status}: ItemProps) {
  const removeUser = trpc.event.removeUser.useMutation();
  const {modal, open} = useConfirmDialog({
    title: 'Remove attendee?',
    description: `Are you sure you want to remove ${user.firstName} ${user.lastName} from the event?`,
    onConfirm: async () => {
      await removeUser.mutateAsync({
        eventId,
        userId: user.id,
      });
      await refetch();
    },
  });

  const label =
    user.firstName +
    ' ' +
    user.lastName +
    ' · ' +
    user.email +
    (hasPlusOne ? ' · +1' : '');

  return (
    <>
      {modal}
      <CardBase key={user.id} className="flex items-center mb-2">
        <Text>{label}</Text>
        <div className="grow" />
        <EventRegistrationStatusBadge status={status} />
        <Button
          isLoading={removeUser.isLoading}
          onClick={open}
          iconLeft={<TrashIcon />}
          variant="danger"
        />
      </CardBase>
    </>
  );
}

function EventAttendeesPage() {
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
      'First name,Last name,Email,Plus one\r\n' +
      data
        ?.map(signUp => {
          return `${signUp.user.firstName},${signUp.user.lastName},${
            signUp.user.email
          },${signUp.hasPlusOne ? 'Yes' : 'No'}`;
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
          {data?.map(signUp => {
            return (
              <Item
                key={signUp.user.id}
                user={signUp.user}
                eventId={eventId}
                refetch={refetch}
                hasPlusOne={signUp.hasPlusOne}
                status={signUp.status}
              />
            );
          })}
        </Container>
      </AppLayout>
    </>
  );
}

export default withProtected(EventAttendeesPage);
