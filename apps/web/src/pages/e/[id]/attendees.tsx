import {EventRegistrationStatus, User} from '@prisma/client';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {
  Container,
  CardBase,
  Button,
  Text,
  PageHeader,
  Spinner,
  LoadingBlock,
} from 'ui';
import {trpc} from 'trpc/src/trpc';
import {saveAs} from 'file-saver';
import {withProtected} from '../../../utils/withAuthProtect';
import {EventRegistrationStatusBadge} from 'ui/src/components/EventRegistrationStatusBadge/EventRegistrationStatusBadge';
import {useConfirmDialog, useEventId} from 'hooks';
import {MessageParticipantsButton} from '../../../features/MessageParticipantsButton/MessageParticipantsButton';
import {UserPlusIcon, DocumentArrowDownIcon} from '@heroicons/react/24/solid';
import {useCallback} from 'react';

interface ItemProps {
  user: User;
  status: EventRegistrationStatus;
  hasPlusOne: boolean | null;
  refetch: () => void;
}

function Item({user, hasPlusOne, status, refetch}: ItemProps) {
  const label =
    user.firstName +
    ' ' +
    user.lastName +
    ' · ' +
    user.email +
    (hasPlusOne ? ' · +1' : '');

  const {mutateAsync} = trpc.event.cancelEventByUserId.useMutation();
  const eventId = useEventId();
  const handleCancelClick = useCallback(async () => {
    if (eventId) {
      await mutateAsync({eventId, userId: user.id}).then(() => refetch());
    }
  }, [mutateAsync, eventId, user.id, refetch]);
  const {open, modal} = useConfirmDialog({
    title: 'Cancel RSVP',
    description: `Are you sure you want to cancel the RSVP for ${user.firstName} ${user.lastName}?`,
    onConfirm: handleCancelClick,
  });

  return (
    <>
      {modal}
      <CardBase key={user.id}>
        <div className="flex items-center">
          <Text>{label}</Text>
          <div className="grow" />
          <EventRegistrationStatusBadge status={status} />
          <Button
            size="sm"
            variant="neutral"
            onClick={open}
            disabled={status === 'CANCELLED'}
          >
            Cancel
          </Button>
        </div>
      </CardBase>
    </>
  );
}

function EventAttendeesPage() {
  const router = useRouter();
  const eventShortId = useEventId();
  const {data, refetch, isLoading} = trpc.event.getAttendees.useQuery(
    {
      eventShortId: eventShortId!,
    },
    {
      enabled: !!eventShortId,
    }
  );

  const handleDownloadCsvClick = () => {
    const content =
      'First name,Last name,Email,Plus one,Status\r\n' +
      data
        ?.map(signUp => {
          return `${signUp.user.firstName},${signUp.user.lastName},${
            signUp.user.email
          },${signUp.hasPlusOne ? 'Yes' : 'No'},${signUp.status}`;
        })
        .join('\r\n')!;
    const blob = new Blob([content], {type: 'text/csv;charset=utf-8'});
    saveAs(blob, 'file.csv');
  };

  if (isLoading) {
    return <LoadingBlock />;
  }

  return (
    <>
      <Head>
        <title>{`Attendees | WannaGo`}</title>
      </Head>
      <Container className="flex flex-col gap-y-4">
        <PageHeader title={'Attendees'}>
          <MessageParticipantsButton />
          <Button
            variant="neutral"
            onClick={() => router.push(`/e/${eventShortId}/invite`)}
            size="sm"
            iconLeft={<UserPlusIcon />}
            title={'Invite'}
          >
            <span className="hidden md:block">Invite</span>
          </Button>
          <Button
            variant="neutral"
            onClick={handleDownloadCsvClick}
            size="sm"
            iconLeft={<DocumentArrowDownIcon />}
            title={'Export CSV'}
          >
            <span className="hidden md:block">Export CSV</span>
          </Button>
        </PageHeader>
        {data?.length === 0 && (
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
              refetch={refetch}
            />
          );
        })}
      </Container>
    </>
  );
}

export default withProtected(EventAttendeesPage);
