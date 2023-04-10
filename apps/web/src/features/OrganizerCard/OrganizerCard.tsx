import {Event} from '@prisma/client';
import {trpc} from 'trpc/src/trpc';
import {OrganizerCard as OrganizerCardView} from 'cards';
import {useCreateConversation} from 'hooks';
import {useRouter} from 'next/router';
import {Button} from 'ui';

interface Props {
  event: Event;
}

export function OrganizerCard({event}: Props) {
  const router = useRouter();
  const organizer = trpc.event.getOrganizer.useQuery({
    eventShortId: event.shortId,
  });
  const {createConversation, isLoading} = useCreateConversation();

  const onMessageOrganizerClick = async () => {
    const conversation = await createConversation({
      organizationId: event?.organizationId,
      userId: event?.userId,
    });

    if (conversation) {
      router.push(`/messages/${conversation.id}`);
    }
  };

  return (
    <OrganizerCardView
      name={organizer.data?.name || 'Loading...'}
      profileImageSrc={
        organizer.data?.profileImageSrc?.includes('gravatar')
          ? null
          : organizer.data?.profileImageSrc
      }
      profilePath={organizer.data?.profilePath || ''}
      action={
        <Button
          onClick={onMessageOrganizerClick}
          variant="link-gray"
          size="xs"
          isLoading={isLoading}
        >
          Message organizer
        </Button>
      }
    />
  );
}
