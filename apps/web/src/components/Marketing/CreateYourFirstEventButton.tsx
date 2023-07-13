'use client';

import {useAuth} from '@clerk/nextjs';
import Link from 'next/link';
import {Button} from 'ui';

export function CreateYourFirstEventButton() {
  const auth = useAuth();
  return (
    <Button className="pointer-events-auto" size="lg" asChild>
      <Link href={auth.userId ? '/e/add' : '/register'}>
        Create your first event
      </Link>
    </Button>
  );
}
