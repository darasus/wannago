import {CardBase} from '../CardBase/CardBase';
import {Badge} from 'ui';
import {Text} from '../Text/Text';
import {User} from '@prisma/client';
import {Button} from 'ui';
import Image from 'next/image';
import {Spinner} from '../Spinner/Spinner';

interface Props {
  onOpenFormClick: () => void;
  isLoading?: boolean;
  user: User | null;
}

export function OrganizerCard({isLoading, onOpenFormClick, user}: Props) {
  const name = user ? `${user?.firstName} ${user?.lastName}` : 'Loading...';

  return (
    <CardBase>
      <div>
        <div className="flex items-center mb-2">
          <Badge color="gray" size="xs" className="mr-2">
            Who
          </Badge>
          <Button onClick={onOpenFormClick} variant="link-gray" size="xs">
            Message organizer
          </Button>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="flex h-10 w-10 items-center overflow-hidden relative justify-center rounded-full safari-rounded-border-fix">
            {isLoading && (
              <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-full border border-gray-200">
                <Spinner className="text-gray-400" />
              </div>
            )}
            {user?.profileImageSrc ? (
              <Image
                src={user?.profileImageSrc}
                alt=""
                style={{objectFit: 'cover'}}
                priority
                width={100}
                height={100}
              />
            ) : (
              <Image
                src={
                  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                }
                alt=""
                fill
                style={{objectFit: 'cover'}}
                priority
              />
            )}
          </div>
          <Text className="font-bold">{name}</Text>
        </div>
      </div>
    </CardBase>
  );
}
