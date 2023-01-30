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

  const heightRatio = featuredImageHeight / featuredImageWidth;
  const imageWidth = 610;
  const imageHeight = Number((heightRatio * imageWidth).toFixed(0));

  return (
    <>
      <CardBase>
        <div
          className={cn(
            'flex items-center overflow-hidden relative justify-center bg-slate-700 rounded-3xl safari-rounded-border-fix mb-4'
          )}
        >
          <Image
            priority
            src={featuredImageSrc}
            alt={title}
            loader={cloudflareImageLoader}
            width={imageWidth}
            height={imageHeight}
            blurDataURL={featuredImagePreviewSrc}
            placeholder={'blur'}
          />
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
