import {LinkIcon} from '@heroicons/react/24/solid';
import Link from 'next/link';
import {Badge, Button, CardBase} from 'ui';

interface Props {
  action?: React.ReactNode;
  url: string;
  publicEventUrl: string;
}

export function UrlCard({action, url, publicEventUrl}: Props) {
  return (
    <CardBase className="h-full">
      <div className="flex items-center mb-2">
        <Badge color="gray" className="mr-2" size="xs">
          Invite
        </Badge>
        {action}
      </div>
      <div className="flex items-center gap-2">
        <Link href={url}>
          <div className="flex justify-center items-center rounded-full h-10 w-10 bg-slate-200 border-2 border-gray-800">
            <LinkIcon className="h-5 w-5" />
          </div>
        </Link>
        <Button variant="link" href={url} as="a">
          {publicEventUrl}
        </Button>
      </div>
    </CardBase>
  );
}
