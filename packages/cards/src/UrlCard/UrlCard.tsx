import {LinkIcon} from '@heroicons/react/24/solid';
import Link from 'next/link';
import {Badge, Button, CardBase, Tooltip} from 'ui';

interface Props {
  action?: React.ReactNode;
  isPublished: boolean;
  url: string;
  publicEventUrl: string;
}

export function UrlCard({action, isPublished, url, publicEventUrl}: Props) {
  return (
    <Tooltip
      text={
        isPublished
          ? undefined
          : 'To see the public link, please publish the event first.'
      }
    >
      <CardBase isBlur={!isPublished} className="h-full">
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
    </Tooltip>
  );
}
