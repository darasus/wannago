import Link from 'next/link';
import {Badge, CardBase, Button, Avatar} from 'ui';

interface Props {
  name: string;
  profileImageSrc: string | undefined | null;
  profilePath: string;
  action?: React.ReactNode;
}

export function OrganizerCard({
  name,
  profileImageSrc,
  profilePath,
  action,
}: Props) {
  return (
    <CardBase>
      <div>
        <div className="flex items-center mb-2">
          <Badge variant="outline" className="mr-1">
            Who
          </Badge>
          {action}
        </div>
        <div className="flex items-center gap-x-2">
          <div className="flex shrink-0  items-center overflow-hidden relative justify-center rounded-full safari-rounded-border-fix">
            <Avatar className="h-10 w-10" src={profileImageSrc} alt="avatar" />
          </div>
          <Button asChild title={name} variant="link">
            <Link href={profilePath}>{name}</Link>
          </Button>
        </div>
      </div>
    </CardBase>
  );
}
