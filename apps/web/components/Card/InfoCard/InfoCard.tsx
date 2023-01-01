import clsx from 'clsx';
import Image from 'next/image';
import {CardBase} from '../../CardBase/CardBase';
import {Badge} from '../../Badge/Badge';
import {Text} from '../../Text/Text';
import {Event} from '@prisma/client';

interface Props {
  event: Event;
}

export function InfoCard({event}: Props) {
  return (
    <>
      <CardBase>
        <div className="flex items-center overflow-hidden relative justify-center aspect-video bg-black rounded-3xl safari-rounded-border-fix mb-4">
          {event.featuredImageSrc && (
            <Image
              src={event.featuredImageSrc}
              alt=""
              fill
              style={{objectFit: 'cover'}}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
        <div>
          <div className="mb-2">
            <Badge color="gray" className="mr-2">
              What
            </Badge>
            {/* <Button variant="link-neutral">Share</Button> */}
          </div>
          <Text className="text-2xl font-bold mb-2">{event.title}</Text>
          <div />
          <div
            className={clsx(
              'prose',
              'prose-h1:text-gray-900 prose-h2:text-gray-900 prose-h3:text-gray-900 prose-h4:text-gray-900 prose-h5:text-gray-900 prose-h6:text-gray-900',
              'prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-md prose-pre:text-gray-900',
              'prose-a:text-brand-700'
            )}
          >
            <div
              className="text-body"
              dangerouslySetInnerHTML={{__html: event.description}}
            />
          </div>
        </div>
      </CardBase>
    </>
  );
}
