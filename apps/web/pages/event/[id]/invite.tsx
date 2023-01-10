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
import {useCallback} from 'react';
import clsx from 'clsx';
import {titleFont} from '../../../fonts';
import {EventRegistrationStatusBadge} from '../../../components/EventRegistrationStatusBadge/EventRegistrationStatusBadge';
import {PageHeader} from '../../../components/PageHeader/PageHeader';

interface ItemProps {
  user: User & {status: EventRegistrationStatus | null};
  eventId: string;
  refetch: () => Promise<any>;
}

function Item({user, eventId, refetch}: ItemProps) {
  const {mutate, isLoading} = trpc.event.invitePastAttendee.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    async onSuccess() {
      await refetch();
      toast.success(`User is successfully invited!`);
    },
  });

  const onInviteClick = useCallback(() => {
    mutate({userId: user.id, eventId});
  }, [eventId, mutate, user.id]);

  return (
    <>
      <CardBase key={user.id} className="flex items-center mb-2">
        <Text>{`${user.firstName} ${user.lastName} · ${user.email}`}</Text>
        <div className="grow" />
        {user.status && <EventRegistrationStatusBadge status={user.status} />}
        {user.status === null && (
          <Button
            isLoading={isLoading}
            onClick={onInviteClick}
            variant="neutral"
            size="sm"
          >
            Invite
          </Button>
        )}
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

export default withProtected(EventAttendeesPage);
