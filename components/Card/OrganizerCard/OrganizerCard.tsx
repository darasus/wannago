import clsx from 'clsx';
import Image from 'next/image';
import {CardBase} from '../CardBase/CardBase';
import {Badge} from '../../Badge/Badge';
import {Text} from '../../Text/Text';
import {Event} from '@prisma/client';

interface Props {
  event: Event;
}

export function OrganizerCard({event}: Props) {
  return (
    <>
      <CardBase>
        <div>
          <div className="mb-2">
            <Badge color="pink" className="mr-2">
              Who
            </Badge>
            {/* <Button variant="link-neutral">Share</Button> */}
          </div>
          <Text className="font-bold">{event.title}</Text>
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
              className="text-boty"
              dangerouslySetInnerHTML={{__html: event.description}}
            />
          </div>
        </div>
      </CardBase>
    </>
  );
}
