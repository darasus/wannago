'use client';

import {
  ChevronDownIcon,
  InboxArrowDownIcon,
  InformationCircleIcon,
  PencilIcon,
  RocketLaunchIcon,
  TrashIcon,
  UserPlusIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import {Event} from '@prisma/client';
import {usePublishEvent, useRemoveEvent, useUnpublishEvent} from 'hooks';
import {usePathname, useParams} from 'next/navigation';
import {forwardRef} from 'react';
import {Button, Menu} from 'ui';

interface Props {
  event: Event;
}

export function ManageEventButton({event}: Props) {
  const params = useParams();
  const pathname = usePathname();
  const shortId = params?.id as string;
  const {modal: removeEventModal, onRemoveClick} = useRemoveEvent({
    eventId: event?.id,
  });
  const {modal: publishModal, onPublishClick} = usePublishEvent({
    eventId: event?.id,
  });
  const {modal: unpublishModal, onUnpublishClick} = useUnpublishEvent({
    eventId: event?.id,
  });

  const ButtonWIthRef = forwardRef<HTMLButtonElement, any>(function ButtonRef(
    props,
    ref
  ) {
    return (
      <Button
        {...props}
        ref={ref}
        className="w-full"
        iconLeft={<ChevronDownIcon />}
        size="md"
        data-testid="manage-event-button"
      >
        Manage event
      </Button>
    );
  });

  return (
    <div className="flex gap-2 w-full">
      {removeEventModal}
      {publishModal}
      {unpublishModal}
      <div className="grow">
        <Menu
          testId="manage-event-menu"
          size="sm"
          activeHref={pathname ?? '/'}
          as={ButtonWIthRef}
          options={[
            {
              label: 'Event info',
              href: `/e/${shortId}/info`,
              iconLeft: <InformationCircleIcon />,
            },
            {
              label: 'Edit event',
              href: `/e/${shortId}/edit`,
              iconLeft: <PencilIcon />,
            },
            {
              label: 'Event attendees',
              href: `/e/${shortId}/attendees`,
              iconLeft: <UsersIcon />,
            },
            {
              label: 'Invite attendees',
              href: `/e/${shortId}/invite`,
              iconLeft: <UserPlusIcon />,
            },
            ...(!event?.isPublished
              ? [
                  {
                    label: 'Publish event',
                    onClick: onPublishClick,
                    variant: 'success',
                    iconLeft: <RocketLaunchIcon />,
                  } as const,
                ]
              : []),
            ...(event?.isPublished
              ? [
                  {
                    label: 'Unpublish event',
                    onClick: onUnpublishClick,
                    variant: 'danger',
                    iconLeft: <InboxArrowDownIcon />,
                  } as const,
                ]
              : []),

            {
              label: 'Remove event',
              onClick: onRemoveClick,
              variant: 'danger',
              iconLeft: <TrashIcon />,
            },
          ]}
        />
      </div>
    </div>
  );
}
