import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid';
import {
  useEventId,
  useEventQuery,
  useIsMyEvent,
  usePublishEvent,
  useRemoveEvent,
  useUnpublishEvent,
} from 'hooks';
import {useRouter} from 'next/router';
import {forwardRef} from 'react';
import {Button, Menu} from 'ui';

export function ManageEventButton() {
  const router = useRouter();
  const {eventShortId} = useEventId();
  const event = useEventQuery({eventShortId});
  const isMyEvent = useIsMyEvent({eventShortId});
  const {modal: removeEventModal, onRemoveClick} = useRemoveEvent({
    eventId: event.data?.id,
  });
  const {modal: publishModal, onPublishClick} = usePublishEvent({
    eventId: event.data?.id,
  });
  const {modal: unpublishModal, onUnpublishClick} = useUnpublishEvent({
    eventId: event.data?.id,
  });

  if (!isMyEvent) return null;

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
        variant="secondary"
        data-testid="manage-event-button"
      >
        Manage event
      </Button>
    );
  });

  return (
    <div className="w-full">
      {removeEventModal}
      {publishModal}
      {unpublishModal}
      <Menu
        testId="manage-event-menu"
        size="sm"
        activeHref={router.asPath}
        as={ButtonWIthRef}
        options={[
          {
            label: 'Event overview',
            href: `/e/${eventShortId}/manage`,
          },
          {
            label: 'Edit event',
            href: `/e/${eventShortId}/edit`,
          },
          {
            label: 'Event attendees',
            href: `/e/${eventShortId}/attendees`,
          },
          {
            label: 'Invite',
            href: `/e/${eventShortId}/invite`,
          },
          ...(!event.data?.isPublished
            ? [
                {
                  label: 'Publish event',
                  onClick: onPublishClick,
                  variant: 'success',
                } as const,
              ]
            : []),
          ...(event.data?.isPublished
            ? [
                {
                  label: 'Unpublish event',
                  onClick: onUnpublishClick,
                  variant: 'danger',
                } as const,
              ]
            : []),

          {
            label: 'Remove event',
            onClick: onRemoveClick,
            variant: 'danger',
          },
        ]}
      />
    </div>
  );
}
