import Link from 'next/link';
import {CardBase, Button, Avatar} from 'ui';

interface Props {
  name: string;
  profileImageSrc: string | undefined | null;
  profilePath: string;
  action?: React.ReactNode;
}

export function OrganizerCardView({
  name,
  profileImageSrc,
  profilePath,
  action,
}: Props) {
  return (
    <CardBase title={'Who'} titleChildren={action}>
      <div>
        <div className="flex items-center gap-x-2">
          <div className="flex shrink-0  items-center overflow-hidden relative justify-center rounded-full safari-rounded-border-fix">
            <Avatar className="h-10 w-10" src={profileImageSrc} alt="avatar" />
          </div>
          <Button asChild title={name} variant="link" className="p-0 h-auto">
            <Link href={profilePath}>{name}</Link>
          </Button>
        </div>
      </div>
    </CardBase>
  );
}
