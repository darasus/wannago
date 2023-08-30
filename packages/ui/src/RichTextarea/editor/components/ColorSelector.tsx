import {Editor} from '@tiptap/core';
import {Check, Paintbrush} from 'lucide-react';
import {FC} from 'react';
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '../../../MenuBar/MenuBar';
import {cn} from 'utils';

export interface BubbleColorMenuItem {
  name: string;
  color: string;
}

interface ColorSelectorProps {
  editor: Editor;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
  {
    name: 'Default',
    color: 'var(--novel-black)',
  },
  {
    name: 'Purple',
    color: '#9333EA',
  },
  {
    name: 'Red',
    color: '#E00000',
  },
  {
    name: 'Yellow',
    color: '#EAB308',
  },
  {
    name: 'Blue',
    color: '#2563EB',
  },
  {
    name: 'Green',
    color: '#008A00',
  },
  {
    name: 'Orange',
    color: '#FFA500',
  },
  {
    name: 'Pink',
    color: '#BA4081',
  },
  {
    name: 'Gray',
    color: '#A8A29E',
  },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
  {
    name: 'Default',
    color: 'var(--novel-highlight-default)',
  },
  {
    name: 'Purple',
    color: 'var(--novel-highlight-purple)',
  },
  {
    name: 'Red',
    color: 'var(--novel-highlight-red)',
  },
  {
    name: 'Yellow',
    color: 'var(--novel-highlight-yellow)',
  },
  {
    name: 'Blue',
    color: 'var(--novel-highlight-blue)',
  },
  {
    name: 'Green',
    color: 'var(--novel-highlight-green)',
  },
  {
    name: 'Orange',
    color: 'var(--novel-highlight-orange)',
  },
  {
    name: 'Pink',
    color: 'var(--novel-highlight-pink)',
  },
  {
    name: 'Gray',
    color: 'var(--novel-highlight-gray)',
  },
];

export const ColorSelector: FC<ColorSelectorProps> = ({editor}) => {
  const activeColorItem = TEXT_COLORS.find(({color}) =>
    editor.isActive('textStyle', {color})
  );

  const activeHighlightItem = HIGHLIGHT_COLORS.find(({color}) =>
    editor.isActive('highlight', {color})
  );

  return (
    <MenubarMenu>
      <MenubarTrigger
        className={cn('px-1 cursor-pointer', {
          // 'bg-muted': !!activeColorItem || !!activeHighlightItem,
        })}
        style={{
          color: activeColorItem?.color || undefined,
          backgroundColor: activeHighlightItem?.color || undefined,
        }}
      >
        {/* <span
          className={cn('px-1', {
            'bg-muted': !!activeColorItem || !!activeHighlightItem,
          })}
          style={{
            color: activeColorItem?.color || undefined,
            backgroundColor: activeHighlightItem?.color || undefined,
          }}
        > */}
        <Paintbrush className="h-4 w-4" />
        {/* </span> */}
      </MenubarTrigger>

      <MenubarContent>
        <MenubarItem disabled>Color</MenubarItem>
        {TEXT_COLORS.map(({name, color}, index) => (
          <MenubarItem
            key={index}
            onClick={() => {
              editor.commands.unsetColor();
              name !== 'Default' &&
                editor.chain().focus().setColor(color).run();
            }}
          >
            <div className="flex items-center space-x-2">
              <div
                className="rounded-sm border border-stone-200 px-1 py-px font-medium"
                style={{color}}
              >
                A
              </div>
              <span>{name}</span>
            </div>
            {editor.isActive('textStyle', {color}) && (
              <Check className="h-4 w-4" />
            )}
          </MenubarItem>
        ))}

        <MenubarSeparator />

        <MenubarItem disabled>Background</MenubarItem>

        {HIGHLIGHT_COLORS.map(({name, color}, index) => (
          <MenubarItem
            key={index}
            onClick={() => {
              editor.commands.unsetHighlight();
              name !== 'Default' && editor.commands.setHighlight({color});
            }}
          >
            <div className="flex items-center space-x-2">
              <div
                className="rounded-sm border border-stone-200 px-1 py-px font-medium"
                style={{backgroundColor: color}}
              >
                A
              </div>
              <span>{name}</span>
            </div>
            {editor.isActive('highlight', {color}) && (
              <Check className="h-4 w-4" />
            )}
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>
  );
};
