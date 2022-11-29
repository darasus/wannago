import clsx from 'clsx';
import Image from 'next/image';
import {Card} from '../DateCard/Card/Card';
import {SectionTitle} from '../Text/SectionTitle';
import {Text} from '../Text/Text';
import {EditControls} from './EditControls';

interface Props {
  eventId: string;
  title: string;
  description: string;
  showManageTools?: boolean;
  featuredImageSrc: string | null;
}

export function InfoCard({
  title,
  description,
  showManageTools,
  eventId,
  featuredImageSrc,
}: Props) {
  return (
    <>
      <Card className="p-0">
        <div className="flex items-center overflow-hidden relative justify-center h-64 bg-black rounded-t-xl safari-rounded-border-fix">
          {showManageTools && <EditControls eventId={eventId} />}
          {featuredImageSrc && (
            <Image
              src={featuredImageSrc}
              alt=""
              fill
              style={{objectFit: 'cover'}}
              priority
            />
          )}
        </div>
        <div className="p-4">
          <div className="mb-2">
            <SectionTitle color="pink" className="mr-2">
              What
            </SectionTitle>
            {/* <Button variant="link-neutral">Share</Button> */}
          </div>
          <Text className="text-2xl font-bold">{title}</Text>
          <div />
          <div
            className={clsx(
              'prose',
              'prose-h1:text-black prose-h2:text-black prose-h3:text-black prose-h4:text-black prose-h5:text-black prose-h6:text-black',
              'prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-md prose-pre:text-gray-900',
              'prose-a:text-brand-700'
            )}
          >
            <div
              className="text-boty"
              dangerouslySetInnerHTML={{__html: description}}
            />
          </div>
        </div>
      </Card>
    </>
  );
}
