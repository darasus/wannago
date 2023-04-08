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

  return (
    <div className="w-full">
      {removeEventModal}
      {publishModal}
      {unpublishModal}
      <Menu
        testId="manage-event-menu"
        size="sm"
        activeHref={router.asPath}
        as={props => (
          <Button
            {...props}
            className="w-full"
            iconLeft={<ChevronDownIcon />}
            size="md"
            variant="secondary"
            data-testid="manage-event-button"
          >
            Manage event
          </Button>
        )}
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
