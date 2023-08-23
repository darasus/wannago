'use client';

import {useAmplitude} from 'hooks';
import Link from 'next/link';
import {Button} from 'ui';

export function GetStartedButton() {
  const {logEvent} = useAmplitude();

  return (
    <Button
      asChild
      onClick={() => {
        logEvent('get_started_button_clicked');
      }}
    >
      <Link href="/sign-up">Get started</Link>
    </Button>
  );
}
