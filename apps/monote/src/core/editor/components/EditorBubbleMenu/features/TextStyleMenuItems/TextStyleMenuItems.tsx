import {Editor} from '@tiptap/core';
import {BubbleMenuItem} from '../../EditorBubbleMenu';
import {Bold, Code, Italic, Strikethrough, Underline} from 'lucide-react';
import {MenuItemButton} from '../../components/MenuItemButton/MenuItemButton';

function createMainItems({editor}: {editor: Editor}) {
  const mainMenuItems: BubbleMenuItem[] = [
    {
      name: <Bold className="w-4 h-4" />,
      isActive: () => editor.isActive('bold'),
      command: () => editor.chain().focus().toggleBold().run(),
    },
    {
      name: <Italic className="w-4 h-4" />,
      isActive: () => editor.isActive('italic'),
      command: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      name: <Underline className="w-4 h-4" />,
      isActive: () => editor.isActive('underline'),
      command: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      name: <Strikethrough className="w-4 h-4" />,
      isActive: () => editor.isActive('strike'),
      command: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      name: <Code className="w-4 h-4" />,
      isActive: () => editor.isActive('code'),
      command: () => editor.chain().focus().toggleCode().run(),
    },
  ];

  return {
    mainMenuItems,
  };
}

interface Props {
  editor: Editor;
}

export function TextStyleMenuItems({editor}: Props) {
  const {mainMenuItems} = createMainItems({
    editor,
  });

  return (
    <>
      {mainMenuItems.map((item, index) => (
        <MenuItemButton
          key={index}
          onClick={() => {
            item.command();
          }}
          isActive={item.isActive()}
        >
          {item.name}
        </MenuItemButton>
      ))}
    </>
  );
}
