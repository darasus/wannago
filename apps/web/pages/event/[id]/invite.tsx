import {EventRegistrationStatus, User} from '@prisma/client';
import Head from 'next/head';
import {useRouter} from 'next/router';
import AppLayout from '../../../components/AppLayout/AppLayout';
import {Button} from '../../../components/Button/Button';
import {CardBase} from '../../../components/CardBase/CardBase';
import {Container} from '../../../components/Container/Container';
import {Text} from '../../../components/Text/Text';
import {trpc} from '../../../utils/trpc';
import {withProtected} from '../../../utils/withAuthProtect';
import {toast} from 'react-hot-toast';
import {EventRegistrationStatusBadge} from '../../../components/EventRegistrationStatusBadge/EventRegistrationStatusBadge';
import {PageHeader} from '../../../components/PageHeader/PageHeader';
import {useConfirmDialog} from '../../../hooks/useConfirmDialog';

interface InviteButtonProps {
  eventId: string;
  user: User;
  refetch?: () => Promise<any>;
  disabled?: boolean;
}

export function InviteButton({
  refetch,
  user,
  eventId,
  disabled,
}: InviteButtonProps) {
  const {mutateAsync, isLoading} = trpc.event.invitePastAttendee.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    async onSuccess() {
      await refetch?.();
      toast.success(`User is successfully invited!`);
    },
  });
  const {open, modal} = useConfirmDialog({
    title: `Invite ${user.firstName} ${user.lastName}?`,
    description: `Are you sure you want to invite ${user.firstName} ${user.lastName} to the event? We will send invitation to this email address: ${user.email}`,
    onConfirm: async () => {
      await mutateAsync({userId: user.id, eventId});
    },
  });

  return (
    <>
      {modal}
      <Button
        isLoading={isLoading}
        onClick={open}
        variant="neutral"
        size="sm"
        disabled={disabled}
      >
        Invite
      </Button>
    </>
  );
}

interface UserRowProps {
  user: User & {status: EventRegistrationStatus | null};
  eventId: string;
  refetch: () => Promise<any>;
}

function UserRow({user, eventId, refetch}: UserRowProps) {
  return (
    <>
      <CardBase key={user.id} className="flex items-center mb-2">
        <Text>{`${user.firstName} ${user.lastName} · ${user.email}`}</Text>
        <div className="grow" />
        {user.status && <EventRegistrationStatusBadge status={user.status} />}
        <InviteButton
          user={user}
          eventId={eventId}
          refetch={refetch}
          disabled={user.status !== null}
        />
      </CardBase>
    </>
  );
}

function EventAttendeesPage() {
  const router = useRouter();
  const eventId = router.query.id as string;
  const {data, refetch} = trpc.event.getAllEventsAttendees.useQuery(
    {eventId},
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
        <Container>
          <PageHeader title={'Invite'} />
          {data.length === 0 && (
            <div className="text-center">
              <Text>{`You don't have users to invite yet...`}</Text>
            </div>
          )}
          {data?.map(user => {
            return (
              <UserRow
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

export default withProtected(EventAttendeesPage);
