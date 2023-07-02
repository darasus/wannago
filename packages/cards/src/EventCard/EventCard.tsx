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
  const isUpcoming = isFuture(
    typeof event.startDate === 'string'
      ? new Date(event.startDate)
      : event.startDate
  );
  const {
    featuredImageHeight,
    featuredImageWidth,
    featuredImagePreviewSrc,
    featuredImageSrc,
    title,
  } = event;

  return (
    <CardBase ref={ref} data-testid="event-card">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Avatar
            className="w-6 h-6 -mr-1"
            src={event.user?.profileImageSrc || event.organization?.logoSrc}
            alt={
              event.user?.firstName ||
              event.organization?.name ||
              'User profile'
            }
          />
          <Text className="text-sm" truncate>
            {event.organization?.name ||
              `${event.user?.firstName} ${event.user?.lastName}`}
          </Text>
          <Badge variant={isUpcoming ? 'default' : 'outline'}>
            {isUpcoming ? 'Upcoming' : 'Past'}
          </Badge>
          <Text className="text-sm text-gray-600 whitespace-nowrap">
            {formatTimeago(event.startDate)}
          </Text>
        </div>
        {featuredImageSrc &&
          featuredImagePreviewSrc &&
          featuredImageWidth &&
          featuredImageHeight && (
            <div className="grow overflow-hidden relative justify-center bg-black rounded-md aspect-video safari-rounded-border-fix">
              {showPublishStatus && (
                <div className="absolute left-4 top-4 z-10">
                  {event.isPublished ? (
                    <Badge>Published</Badge>
                  ) : (
                    <Badge variant={'outline'}>Draft</Badge>
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
        <div>
          <Text className="text-2xl font-bold line-clamp-2">{event.title}</Text>
        </div>
      </div>
    </CardBase>
  );
});
