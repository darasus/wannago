'use client';

import {Button} from 'ui';
import {useParams} from 'next/dist/client/components/navigation';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

export function MessageButton() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string | undefined;
  const organizationId = params?.organizationId as string | undefined;
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isLoading}
      isLoading={isLoading}
      onClick={async () => {
        setIsLoading(true);
      }}
      data-testid="message-button"
    >
      Message
    </Button>
  );
}
