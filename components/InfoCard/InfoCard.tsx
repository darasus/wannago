import Image from 'next/image';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {SectionTitle} from '../Text/SectionTitle';
import {Text} from '../Text/Text';

interface Props {
  title: string;
  description: string;
}

export function InfoCard({title, description}: Props) {
  return (
    <>
      <Card className="p-0">
        <div className="flex items-center overflow-hidden relative justify-center h-64 bg-black rounded-t-xl">
          <Image
            src="https://source.unsplash.com/GNwiKB34eGs"
            alt=""
            fill
            style={{objectFit: 'cover'}}
          />
        </div>
        <div className="p-4">
          <div className="mb-2">
            <SectionTitle color="green" className="mr-2">
              What
            </SectionTitle>
            <Button variant="link-neutral">Share</Button>
          </div>
          <Text className="text-2xl font-bold">{title}</Text>
          <div />
          <Text>{description}</Text>
        </div>
      </Card>
    </>
  );
}
