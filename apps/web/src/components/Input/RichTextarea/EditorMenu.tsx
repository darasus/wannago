import {Editor} from '@tiptap/react';
import {Button} from 'ui';

interface Props {
  editor: Editor;
  additionalEditorMenu?: React.ReactNode;
}

export function EditorMenu({editor, additionalEditorMenu}: Props) {
  const items = [
    {
      onClick: () => editor.chain().focus().toggleHeading({level: 1}).run(),
      isActive: editor.isActive('heading', {level: 1}),
      label: 'h1',
    },
    {
      onClick: () => editor.chain().focus().toggleHeading({level: 2}).run(),
      isActive: editor.isActive('heading', {level: 2}),
      label: 'h2',
    },
    {
      onClick: () => editor.chain().focus().toggleHeading({level: 3}).run(),
      isActive: editor.isActive('heading', {level: 3}),
      label: 'h3',
    },
    {
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      label: 'bold',
    },
    {
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      label: 'italic',
    },
    {
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      label: 'strike',
    },
  ];

  return (
    <div className="flex gap-1 flex-wrap">
      {additionalEditorMenu}
      {items.map(item => {
        return (
          <Button
            key={item.label}
            size="xs"
            onClick={item.onClick}
            variant={item.isActive ? 'primary' : 'neutral'}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}
