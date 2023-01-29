import Image from 'next/image';
import {CardBase} from '../CardBase/CardBase';
import {Badge} from '../Badge/Badge';
import {cn} from '../../utils/cn';
import {cloudflareImageLoader} from '../../utils/cloudflareImageLoader';
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

  const isNewImage = Boolean(
    typeof featuredImageHeight === 'number' &&
      typeof featuredImageWidth === 'number'
  );

  return (
    <>
      <CardBase>
        <div
          className={cn(
            'flex items-center overflow-hidden relative justify-center bg-slate-700 rounded-3xl safari-rounded-border-fix mb-4',
            {
              'aspect-video': !isNewImage,
            }
          )}
        >
          {featuredImageSrc && (
            <Image
              priority
              src={featuredImageSrc}
              alt={title}
              loader={cloudflareImageLoader}
              fill={!isNewImage}
              style={!isNewImage ? {objectFit: 'cover'} : {}}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              width={featuredImageWidth || undefined}
              height={featuredImageHeight || undefined}
              blurDataURL={featuredImagePreviewSrc || undefined}
              placeholder={isNewImage ? 'blur' : undefined}
            />
          )}
        </div>
        <div>
          <div className="mb-2">
            <Badge color="gray" className="mr-2" size="xs">
              What
            </Badge>
            {/* <Button variant="link">Share</Button> */}
          </div>
          <h1 className="text-3xl font-bold mb-2" data-testid="event-title">
            {title}
          </h1>
          <div />
          <div
            className={cn(
              'prose',
              'prose-h1:text-gray-900 prose-h2:text-gray-900 prose-h3:text-gray-900 prose-h4:text-gray-900 prose-h5:text-gray-900 prose-h6:text-gray-900',
              'prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-md prose-pre:text-gray-900',
              'prose-a:text-brand-700'
            )}
          >
            <div
              className="text-body"
              dangerouslySetInnerHTML={{__html: description}}
            />
          </div>
        </div>
      </CardBase>
    </>
  );
}
