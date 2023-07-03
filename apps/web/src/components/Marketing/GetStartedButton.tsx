'use client';

import {useAmplitudeAppDir} from 'hooks';
import Link from 'next/link';
import {Button} from 'ui';

export function GetStartedButton() {
  const {logEvent} = useAmplitudeAppDir();

  return (
    <Button
      asChild
      onClick={() => {
        logEvent('get_started_button_clicked');
      }}
    >
      <Link href="/register">Get started</Link>
    </Button>
  );
}
