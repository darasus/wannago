'use client';

import {Event, Organization, User} from '@prisma/client';
import {useRouter} from 'next/navigation';
import {api} from '../../../../apps/web/src/trpc/client';
import {useState} from 'react';
import Link from 'next/link';
import {CardBase, Button, Avatar} from 'ui';

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
    <CardBase
      title={'Who'}
      titleChildren={
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
    >
      <div>
        <div className="flex items-center gap-x-2">
          <div className="flex shrink-0  items-center overflow-hidden relative justify-center rounded-full safari-rounded-border-fix">
            <Avatar
              className="h-10 w-10"
              src={imageSrc?.includes('gravatar') ? null : imageSrc}
              alt="avatar"
            />
          </div>
          <Button
            asChild
            title={organizerName}
            variant="link"
            className="p-0 h-auto"
          >
            <Link href={profilePath}>{organizerName}</Link>
          </Button>
        </div>
      </div>
    </CardBase>
  );
}
