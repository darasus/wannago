'use client';

import {Button} from 'ui';
import {useHelpSidePanel} from '../../hooks/useHelpSidePanel';
import {Command} from 'lucide-react';

export function HelpButton() {
  const state = useHelpSidePanel();

  return (
    <Button
      onClick={() => {
        state.toggle();
      }}
      className="p-0 h-6 w-6 flex items-center"
      variant={'ghost'}
    >
      <Command className="h-4 w-4" />
    </Button>
  );
}
