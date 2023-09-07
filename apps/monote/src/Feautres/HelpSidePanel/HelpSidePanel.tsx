'use client';

import {shortcutFont} from '../../core/fonts';
import {useHelpSidePanel} from '../../hooks/useHelpSidePanel';
import {cn} from '../../utils';

function Kbd({children}: {children: React.ReactNode}) {
  return (
    <kbd className={cn('border  rounded px-1 text-xs', shortcutFont.className)}>
      {children}
    </kbd>
  );
}

const shortcuts: [string, [string, string, string]][] = [
  ['Normal text', ['⌘', '⌥', '0']],
  ['Heading 1', ['⌘', '⌥', '1']],
  ['Heading 2', ['⌘', '⌥', '2']],
  ['Heading 3', ['⌘', '⌥', '3']],
  ['Bold', ['⌘', '⇧', 'b']],
  ['Italic', ['⌘', '⇧', 'i']],
  ['Underline', ['⌘', '⇧', 'u']],
  ['Strike', ['⌘', '⇧', 's']],
  ['Highlight', ['⌘', '⇧', 'h']],
  ['Code', ['⌘', 'e', '']],
  ['Numbered list', ['⌘', '⇧', '7']],
  ['Bullet list', ['⌘', '⇧', '8']],
  ['Task list', ['⌘', '⇧', '9']],
];

export function HelpSidePanel() {
  const state = useHelpSidePanel();

  if (!state.isOpen) {
    return null;
  }

  return (
    <div className="sticky top-0 border-l bg-muted-light h-screen min-w-[300px] p-4">
      <div className="mb-4">
        <span>⌘ Keyboard shortcuts</span>
      </div>
      <div className="space-y-1">
        {shortcuts.map((s, i) => {
          return (
            <div className="flex items-center gap-2 text-sm" key={i}>
              {s[1].map((k, i) => {
                return k && <Kbd key={i}>{k}</Kbd>;
              })}
              <div className="grow" />
              {s[0]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
