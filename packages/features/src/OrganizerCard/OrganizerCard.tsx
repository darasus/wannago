'use client';

import {Event, Organization, User} from '@prisma/client';
import {OrganizerCardView} from './OrganizerCardView';
import {useRouter} from 'next/navigation';
import {Button} from 'ui';
import {api} from '../../../../apps/web/src/trpc/client';
import {useState} from 'react';

interface Props {
  event: Event & {
    user: User | null;
    organization: Organization | null;
  };
}

export function OrganizerCard({event}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onMessageOrganizerClick = async () => {
    setIsLoading(true);
    const conversation = await api.conversation.createConversation
      .mutate({
        organizationId: event?.organizationId || undefined,
        userId: event?.userId || undefined,
      })
      .finally(() => {
        setIsLoading(false);
      });

    if (conversation) {
      router.push(`/messages/${conversation?.id}`);
    }
  };

  const organizerName = (
    event.user?.firstName
      ? `${event.user?.firstName} ${event.user?.lastName}`
      : event.organization?.name
  ) as string;

  const imageSrc = (event.user?.profileImageSrc ||
    event.organization?.logoSrc) as string;
  const profilePath = event.user?.id
    ? `/u/${event.user?.id}`
    : `/o/${event.organization?.id}`;

  return (
    <OrganizerCardView
      name={organizerName}
      profileImageSrc={imageSrc?.includes('gravatar') ? null : imageSrc}
      profilePath={profilePath}
      action={
        <Button
          onClick={onMessageOrganizerClick}
          variant="link"
          size="sm"
          disabled={isLoading}
          isLoading={isLoading}
          className="p-0 h-auto"
        >
          Message organizer
        </Button>
      }
    />
  );
}
