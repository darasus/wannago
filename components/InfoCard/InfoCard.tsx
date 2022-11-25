import Image from 'next/image';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {SectionTitle} from '../Text/SectionTitle';
import {Text} from '../Text/Text';
import {EditControls} from './EditControls';

interface Props {
  eventId: string;
  title: string;
  description: string;
  showManageTools?: boolean;
}

export function InfoCard({
  title,
  description,
  showManageTools,
  eventId,
}: Props) {
  return (
    <>
      <Card className="p-0">
        <div className="flex items-center overflow-hidden relative justify-center h-64 bg-black rounded-t-xl">
          {showManageTools && <EditControls eventId={eventId} />}
          <Image
            src="https://source.unsplash.com/GNwiKB34eGs"
            alt=""
            fill
            style={{objectFit: 'cover'}}
            priority
          />
        </div>
        <div className="p-4">
          <div className="mb-2">
            <SectionTitle color="green" className="mr-2">
              What
            </SectionTitle>
            {/* <Button variant="link-neutral">Share</Button> */}
          </div>
          <Text className="text-2xl font-bold">{title}</Text>
          <div />
          <Text>{description}</Text>
        </div>
      </Card>
    </>
  );
}
