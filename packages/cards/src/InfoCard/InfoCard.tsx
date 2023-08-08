'use client';

import Image from 'next/image';
import {Button, CardBase, LoadingBlock} from 'ui';
import {cn} from 'utils';
import {cloudflareImageLoader} from 'utils';
import {Event} from '@prisma/client';
import clip from 'text-clipper';
import {useState} from 'react';
import {Info} from 'lucide-react';
import {proseClassname} from 'const';

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

  const badge = isMyEvent
    ? event.isPublished
      ? ({
          label: (
            <div
              className="flex items-center gap-1"
              data-testid="event-published-badge"
            >
              Published <Info className="h-3 w-3" />
            </div>
          ),
          color: 'green',
          content: 'Your event is published and can be shared.',
        } as const)
      : ({
          label: (
            <div className="flex items-center gap-1">
              Draft <Info className="h-3 w-3" />
            </div>
          ),
          color: 'yellow',
          content:
            'Your event is not published yet. To be able to share your event please publish it first.',
        } as const)
    : undefined;

  return (
    <>
      <CardBase badge={badge} title={'What'}>
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
              <div className={proseClassname}>
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
