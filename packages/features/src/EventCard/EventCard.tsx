'use client';

import {isFuture} from 'date-fns';
import {RouterOutputs} from 'api';
import Image from 'next/image';
import {formatCents, getRelativeTime, getConfig} from 'utils';
import {Avatar, CardBase, ColoredBadge, Text} from 'ui';
import {forwardRef} from 'react';

interface Props {
  event:
    | RouterOutputs['event']['getMyEvents'][0]
    | RouterOutputs['event']['getRandomExample']
    | RouterOutputs['event']['getExamples'][0];
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
            src={`/logo.png`}
            alt={getConfig().name}
          />
          <Text className="text-sm truncate break-keep">
            {getConfig().name}
          </Text>
        </div>
      }
      titleChildren={
        <div className="flex items-center gap-1">
          <ColoredBadge
            className="shrink-0 py-1"
            color={isUpcoming ? 'green' : 'default'}
          >
            {getRelativeTime(event.startDate, event.endDate)}
          </ColoredBadge>
          <div className="grow" />
          <ColoredBadge className="shrink-0 py-1" color="default">
            {price}
          </ColoredBadge>
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
                    <ColoredBadge className="py-1" color="green">
                      Published
                    </ColoredBadge>
                  ) : (
                    <ColoredBadge className="py-1" color="default">
                      Draft
                    </ColoredBadge>
                  )}
                </div>
              )}
              <Image
                className="bg-cover bg-center"
                src={featuredImageSrc}
                alt={title}
                // loader={imageLoader}
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
          <Text className="">{event.address}</Text>
        </div>
      </div>
    </CardBase>
  );
});
