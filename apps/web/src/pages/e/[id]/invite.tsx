import {EventRegistrationStatus, User} from '@prisma/client';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {
  Button,
  CardBase,
  PageHeader,
  Container,
  Text,
  Spinner,
  LoadingBlock,
} from 'ui';
import {trpc} from 'trpc/src/trpc';
import {withProtected} from '../../../utils/withAuthProtect';
import {toast} from 'react-hot-toast';
import {EventRegistrationStatusBadge} from 'ui/src/components/EventRegistrationStatusBadge/EventRegistrationStatusBadge';
import {useConfirmDialog} from 'hooks';
import {AdminInviteButton} from '../../../features/AdminInviteButton/AdminInviteButton';

interface InviteButtonProps {
  eventShortId: string;
  user: User;
  refetch?: () => Promise<any>;
  disabled?: boolean;
}

export function InviteButton({
  refetch,
  user,
  eventShortId,
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
      await mutateAsync({userId: user.id, eventShortId});
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
  eventShortId: string;
  refetch: () => Promise<any>;
}

function UserRow({user, eventShortId, refetch}: UserRowProps) {
  return (
    <>
      <CardBase key={user.id}>
        <div className="flex items-center">
          <Text>{`${user.firstName} ${user.lastName} · ${user.email}`}</Text>
          <div className="grow" />
          {user.status && <EventRegistrationStatusBadge status={user.status} />}
          <InviteButton
            user={user}
            eventShortId={eventShortId}
            refetch={refetch}
            disabled={user.status !== null}
          />
        </div>
      </CardBase>
    </>
  );
}

function EventAttendeesPage() {
  const router = useRouter();
  const eventShortId = router.query.id as string;
  const {data, refetch, isLoading} = trpc.event.getAllEventsAttendees.useQuery(
    {eventShortId: eventShortId!},
    {
      enabled: !!eventShortId,
    }
  );

  if (isLoading) {
    return <LoadingBlock />;
  }

  return (
    <>
      <Head>
        <title>{`Attendees | WannaGo`}</title>
      </Head>
      <Container className="flex flex-col gap-y-4">
        <PageHeader title={'Invite'}>
          <AdminInviteButton refetch={refetch} />
        </PageHeader>
        {data?.length === 0 && (
          <div className="text-center">
            <Text>{`You don't have users to invite yet...`}</Text>
          </div>
        )}
        {data?.map(user => {
          return (
            <UserRow
              key={user.id}
              user={user}
              eventShortId={eventShortId}
              refetch={refetch}
            />
          );
        })}
      </Container>
    </>
  );
}

export default withProtected(EventAttendeesPage);
