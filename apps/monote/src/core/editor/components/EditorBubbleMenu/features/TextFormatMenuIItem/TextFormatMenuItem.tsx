import {Editor} from '@tiptap/core';
import {Check} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from 'ui';
import {BubbleMenuItem} from '../../EditorBubbleMenu';
import {MenuItemButton} from '../../components/MenuItemButton/MenuItemButton';

interface Props {
  editor: Editor;
}

function createNodeSelectorItems({editor}: Props) {
  const nodeSelectorItems: BubbleMenuItem[] = [
    {
      name: 'Text',
      command: () =>
        editor.chain().focus().toggleNode('paragraph', 'paragraph').run(),
      // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
      isActive: () =>
        editor.isActive('paragraph') &&
        !editor.isActive('bulletList') &&
        !editor.isActive('orderedList'),
    },
    {
      name: 'Heading 1',
      command: () => editor.chain().focus().toggleHeading({level: 1}).run(),
      isActive: () => editor.isActive('heading', {level: 1}),
    },
    {
      name: 'Heading 2',
      command: () => editor.chain().focus().toggleHeading({level: 2}).run(),
      isActive: () => editor.isActive('heading', {level: 2}),
    },
    {
      name: 'Heading 3',
      command: () => editor.chain().focus().toggleHeading({level: 3}).run(),
      isActive: () => editor.isActive('heading', {level: 3}),
    },
    {
      name: 'To-do List',
      command: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive('taskItem'),
    },
    {
      name: 'Bullet list',
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      name: 'Numbered list',
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    {
      name: 'Quote',
      command: () =>
        editor
          .chain()
          .focus()
          .toggleNode('paragraph', 'paragraph')
          .toggleBlockquote()
          .run(),
      isActive: () => editor.isActive('blockquote'),
    },
    {
      name: 'Code',
      command: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive('codeBlock'),
    },
  ];

  const nodeSelectorItemActive = nodeSelectorItems
    .filter((item) => item.isActive())
    .pop() ?? {
    name: 'Multiple',
  };

  return {nodeSelectorItems, nodeSelectorItemActive};
}

export function TextFormatMenuItem({editor}: {editor: Editor}) {
  const {nodeSelectorItemActive, nodeSelectorItems} = createNodeSelectorItems({
    editor,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MenuItemButton
          className="px-2"
          isActive={
            editor.isActive('heading', {level: 1}) ||
            editor.isActive('heading', {level: 2}) ||
            editor.isActive('heading', {level: 3})
          }
        >
          <span className="whitespace-nowrap">
            {nodeSelectorItemActive?.name}
          </span>
        </MenuItemButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          {nodeSelectorItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={(e) => {
                item.command();
                e.preventDefault();
              }}
            >
              <span>{item.name}</span>
              {nodeSelectorItemActive.name === item.name && (
                <Check className="h-4 w-4 ml-2 text-green-500" />
              )}
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
