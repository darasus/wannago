'use client';

import Image from 'next/image';
import {Button, CardBase, InfoIconWithTooltip, LoadingBlock} from 'ui';
import {cn} from 'utils';
import {cloudflareImageLoader} from 'utils';
import {Event} from '@prisma/client';
import clip from 'text-clipper';
import {useState} from 'react';

interface Props {
  event: Event;
  isLoadingImage?: boolean;
  isMyEvent?: boolean;
}

const maxDescriptionLength = 550;

export function InfoCard({event, isLoadingImage, isMyEvent}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    description,
    title,
    featuredImageSrc,
    featuredImageHeight,
    featuredImageWidth,
    featuredImagePreviewSrc,
  } = event;
  const trimmedDescription = description
    ? clip(description, maxDescriptionLength, {
        html: true,
        indicator: '...',
      })
    : '';
  const hasReachedDescriptionLength =
    trimmedDescription.length !== description?.length;

  const canRenderImage =
    featuredImageSrc &&
    featuredImagePreviewSrc &&
    featuredImageWidth &&
    featuredImageHeight &&
    !isLoadingImage;

  const badges = isMyEvent
    ? [
        ...(event.isPublished
          ? ([
              {
                badgeColor: 'green',
                badgeContent: (
                  <div className="flex gap-[2px]">
                    <span
                      className="text-xs uppercase font-bold"
                      data-testid="event-published-badge"
                    >
                      Published
                    </span>{' '}
                    <InfoIconWithTooltip text="Your event is published and can be shared." />
                  </div>
                ),
              },
            ] as const)
          : ([
              {
                badgeColor: 'yellow',
                badgeContent: (
                  <div className="flex gap-[2px]">
                    <span className="text-xs uppercase font-bold">Draft</span>{' '}
                    <InfoIconWithTooltip text="Your event is not published yet. To be able to share your event please publish it first." />
                  </div>
                ),
              },
            ] as const)),
      ]
    : undefined;

  return (
    <>
      <CardBase badges={badges} title={'What'}>
        {isLoadingImage && (
          <div className="flex flex-col items-center overflow-hidden relative justify-center bg-gray-300 rounded-md safari-rounded-border-fix mb-4 aspect-square">
            <LoadingBlock />
          </div>
        )}
        {canRenderImage && (
          <div
            className={cn(
              'overflow-hidden relative justify-center bg-slate-700 rounded-md safari-rounded-border-fix mb-4'
            )}
          >
            <Image
              id="event-image"
              priority
              src={featuredImageSrc}
              alt={title}
              loader={cloudflareImageLoader}
              width={featuredImageWidth}
              height={featuredImageHeight}
              blurDataURL={featuredImagePreviewSrc}
              placeholder={'blur'}
              sizes="320 640 750 1000"
              style={{
                width: '100%',
              }}
            />
          </div>
        )}
        <div className="flex flex-col gap-y-2">
          <h1
            className="text-3xl font-bold break-words"
            data-testid="event-title"
          >
            {title}
          </h1>
          {description && (
            <>
              <div
                className={cn(
                  'prose',
                  'prose-h1:text-gray-900 prose-h2:text-gray-900 prose-h3:text-gray-900 prose-h4:text-gray-900 prose-h5:text-gray-900 prose-h6:text-gray-900',
                  'prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-md prose-pre:text-gray-900',
                  'prose-a:text-brand-700',
                  'prose-p:break-words prose-p:mt-0 prose-p:mb-0'
                )}
              >
                <div
                  className="flex flex-col gap-y-2"
                  dangerouslySetInnerHTML={{
                    __html: isExpanded ? description : trimmedDescription,
                  }}
                />
                {!isExpanded && hasReachedDescriptionLength && (
                  <Button
                    className="w-full mt-2"
                    variant={'outline'}
                    size={'sm'}
                    onClick={() => {
                      setIsExpanded(true);
                    }}
                  >
                    Read more
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </CardBase>
    </>
  );
}
