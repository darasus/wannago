import {Event, Organization, User} from '@prisma/client';
import {isFuture} from 'date-fns';
import Image from 'next/image';
import {cloudflareImageLoader, formatTimeago} from 'utils';
import {Avatar, Badge, CardBase, Text} from 'ui';
import {forwardRef} from 'react';

interface Props {
  event: Event & {user?: User | null; organization?: Organization | null};
  showPublishStatus?: boolean;
}

export const EventCard = forwardRef<HTMLDivElement, Props>(function EventCard(
  {event, showPublishStatus = false},
  ref
) {
  const isUpcoming = isFuture(event.startDate);
  const {
    featuredImageHeight,
    featuredImageWidth,
    featuredImagePreviewSrc,
    featuredImageSrc,
    title,
  } = event;

  return (
    <CardBase ref={ref} data-testid="event-card">
      {featuredImageSrc &&
        featuredImagePreviewSrc &&
        featuredImageWidth &&
        featuredImageHeight && (
          <div className="grow overflow-hidden relative justify-center bg-black rounded-3xl aspect-video safari-rounded-border-fix mb-4">
            {showPublishStatus && (
              <div className="absolute left-4 top-4 z-10">
                {event.isPublished ? (
                  <Badge color="green" size="xs">
                    Published
                  </Badge>
                ) : (
                  <Badge color="gray" size="xs">
                    Draft
                  </Badge>
                )}
              </div>
            )}
            <Image
              className="bg-cover bg-center"
              src={featuredImageSrc}
              alt={title}
              loader={cloudflareImageLoader}
              blurDataURL={featuredImagePreviewSrc}
              placeholder={'blur'}
              sizes="320 640 750 1000"
              fill
              style={{
                objectFit:
                  featuredImageHeight > featuredImageWidth ||
                  featuredImageHeight === featuredImageWidth
                    ? 'contain'
                    : 'cover',
                backgroundImage: 'url(' + featuredImagePreviewSrc + ')',
              }}
            />
          </div>
        )}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Avatar
              className="w-6 h-6"
              src={event.user?.profileImageSrc || event.organization?.logoSrc}
              alt={
                event.user?.firstName ||
                event.organization?.name ||
                'User profile'
              }
            />
            <Text className="text-sm">
              {event.organization?.name ||
                `${event.user?.firstName} ${event.user?.lastName}`}
            </Text>
          </div>
          <Badge color={isUpcoming ? 'green' : 'gray'} size="xs">
            {isUpcoming ? 'Upcoming' : 'Past'}
          </Badge>
          <Text className="text-sm text-gray-600">
            {formatTimeago(event.startDate)}
          </Text>
        </div>
        <div />
        <Text className="text-2xl font-bold line-clamp-2">{event.title}</Text>
      </div>
    </CardBase>
  );
});
