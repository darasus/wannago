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
import {EventRegistrationStatusBadge} from '../../../components/EventRegistrationStatusBadge/EventRegistrationStatusBadge';
import {PageHeader} from '../../../components/PageHeader/PageHeader';
import {useEventId} from '../../../hooks/useEventId';

interface ItemProps {
  user: User;
  status: EventRegistrationStatus;
  hasPlusOne: boolean | null;
}

function Item({user, hasPlusOne, status}: ItemProps) {
  const label =
    user.firstName +
    ' ' +
    user.lastName +
    ' · ' +
    user.email +
    (hasPlusOne ? ' · +1' : '');

  return (
    <CardBase key={user.id} className="flex items-center mb-2">
      <Text>{label}</Text>
      <div className="grow" />
      <EventRegistrationStatusBadge status={status} />
    </CardBase>
  );
}

function EventAttendeesPage() {
  const router = useRouter();
  const eventId = useEventId();
  const {data} = trpc.event.getAttendees.useQuery(
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
          <PageHeader title={'Attendees'}>
            <Button
              variant="neutral"
              onClick={() => router.push(`/event/${eventId}/invite`)}
              size="sm"
            >
              Invite
            </Button>
            <Button
              variant="neutral"
              onClick={handleDownloadCsvClick}
              size="sm"
            >
              Export CSV
            </Button>
          </PageHeader>
          {data.length === 0 && (
            <div className="text-center">
              <Text>No attendees yet...</Text>
            </div>
          )}
          {data?.map(signUp => {
            return (
              <Item
                key={signUp.user.id}
                user={signUp.user}
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
