import Image from 'next/image';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {SectionTitle} from '../Text/SectionTitle';
import {Text} from '../Text/Text';
import {PencilIcon, TrashIcon} from '@heroicons/react/24/solid';
import {useRouter} from 'next/router';
import {api} from '../../lib/api';

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
  // const router = useRouter();

  const handleEditClick = () => {
    // router.push(`/event/${eventId}/edit`);
  };

  const handleDeleteClick = async () => {
    await api.deleteEvent(eventId);
    // router.push('/');
  };

  return (
    <>
      <Card className="p-0">
        <div className="flex items-center overflow-hidden relative justify-center h-64 bg-black rounded-t-xl">
          {showManageTools && (
            <div className="p-2 rounded-md absolute top-2 right-2 z-10 bg-gray-100">
              <Button
                className="px-2 py-2 mr-2"
                variant="secondary"
                size="xl"
                iconLeft={<PencilIcon className="h-5 w-5" aria-hidden="true" />}
                onClick={handleEditClick}
              />
              <Button
                className="px-2 py-2"
                variant="danger"
                size="xs"
                iconLeft={<TrashIcon className="h-5 w-5" aria-hidden="true" />}
                onClick={handleDeleteClick}
              />
            </div>
          )}
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
