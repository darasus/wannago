import Image from 'next/image';
import {Badge, CardBase} from 'ui';
import {cn} from 'utils';
import {cloudflareImageLoader} from 'utils';
import {Event} from '@prisma/client';

interface Props {
  event: Event;
}

export function InfoCard({event}: Props) {
  const {
    description,
    title,
    featuredImageSrc,
    featuredImageHeight,
    featuredImageWidth,
    featuredImagePreviewSrc,
  } = event;

  return (
    <>
      <CardBase>
        {featuredImageSrc && (
          <div
            className={cn(
              'flex items-center overflow-hidden relative justify-center bg-slate-700 rounded-3xl safari-rounded-border-fix mb-4'
            )}
          >
            {featuredImagePreviewSrc &&
              featuredImageWidth &&
              featuredImageHeight && (
                <Image
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
                    backgroundImage: 'url(' + featuredImagePreviewSrc + ')',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                  }}
                />
              )}
          </div>
        )}
        <div className="flex flex-col gap-y-2">
          <div>
            <Badge color="gray" className="mr-2" size="xs">
              What
            </Badge>
            {/* <Button variant="link">Share</Button> */}
          </div>
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
                  'prose-p:break-words'
                )}
              >
                <div
                  className="text-body"
                  dangerouslySetInnerHTML={{__html: description}}
                />
              </div>
            </>
          )}
        </div>
      </CardBase>
    </>
  );
}
