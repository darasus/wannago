import {isFuture} from 'date-fns';
import {RouterOutputs} from 'api';
import Image from 'next/image';
import {cloudflareImageLoader, formatCents, getRelativeTime} from 'utils';
import {Avatar, Badge, CardBase, Text} from 'ui';
import {forwardRef} from 'react';

interface Props {
  event: RouterOutputs['event']['getMyEvents'][0];
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

  const price =
    event.tickets.length > 0
      ? `From ${formatCents(event.tickets?.[0].price, event.preferredCurrency)}`
      : 'Free';

  return (
    <CardBase
      ref={ref}
      data-testid="event-card"
      title={
        <div className="flex items-center gap-2">
          <Avatar
            className="w-6 h-6 shrink-0"
            src={event.user?.profileImageSrc || event.organization?.logoSrc}
            alt={
              event.user?.firstName ||
              event.organization?.name ||
              'User profile'
            }
          />
          <Text className="text-sm truncate break-keep">
            {event.organization?.name ||
              `${event.user?.firstName} ${event.user?.lastName}`}
          </Text>
        </div>
      }
      titleChildren={
        <div className="flex items-center gap-1">
          <Badge
            className="shrink-0"
            variant={isUpcoming ? 'positive' : 'outline'}
          >
            {getRelativeTime(event.startDate, event.endDate)}
          </Badge>
          <div className="grow" />
          <Badge className="shrink-0" variant={'outline'}>
            {price}
          </Badge>
        </div>
      }
    >
      <div className="flex items-center gap-4">
        {featuredImageSrc &&
          featuredImagePreviewSrc &&
          featuredImageWidth &&
          featuredImageHeight && (
            <div className="shrink-0 overflow-hidden relative justify-center bg-black rounded-md aspect-video safari-rounded-border-fix w-36 h-36">
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
          <Text className="text-2xl font-bold line-clamp-2 leading-none">
            {event.title}
          </Text>
          <br />
          <Text className="">{event.address}</Text>
        </div>
      </div>
    </CardBase>
  );
});
