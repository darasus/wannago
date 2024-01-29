'use client';

import {Event} from '@prisma/client';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import Link from 'next/link';
import {CardBase, Button, Avatar} from 'ui';
import {config} from 'config';

interface Props {
  event: Event;
}

export function OrganizerCard({event}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onMessageOrganizerClick = async () => {
    setIsLoading(true);
  };

  return (
    <CardBase
      title={'Who'}
      titleChildren={
        <Button
          onClick={onMessageOrganizerClick}
          variant="link"
          size="sm"
          disabled={isLoading}
          isLoading={isLoading}
          className="p-0 h-auto"
        >
          Message organizer
        </Button>
      }
    >
      <div>
        <div className="flex items-center gap-x-2">
          <div className="flex shrink-0  items-center overflow-hidden relative justify-center rounded-full safari-rounded-border-fix">
            <Avatar className="h-10 w-10" src={config.logoSrc} alt="avatar" />
          </div>
          <Button
            asChild
            title={config.name}
            variant="link"
            className="p-0 h-auto"
          >
            <Link href={'/'}>{config.name}</Link>
          </Button>
        </div>
      </div>
    </CardBase>
  );
}
