import {Badge, CardBase, Button, Spinner, Text, Avatar} from 'ui';
import {User} from '@prisma/client';

interface Props {
  onOpenFormClick: () => void;
  name: string;
  profileImageSrc: string | undefined | null;
  profilePath: string | undefined;
}

export function OrganizerCard({
  onOpenFormClick,
  name,
  profileImageSrc,
  profilePath,
}: Props) {
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
          <div className="flex shrink-0  items-center overflow-hidden relative justify-center rounded-full safari-rounded-border-fix">
            <Avatar className="h-10 w-10" src={profileImageSrc} alt="avatar" />
          </div>
          <Button as={'a'} href={profilePath} title={name} variant="link">
            {name}
          </Button>
        </div>
      </div>
    </CardBase>
  );
}
