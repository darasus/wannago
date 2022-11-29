import {Editor} from '@tiptap/react';
import {BubbleMenuButton} from './BubbleMenuButton';

interface Props {
  editor: Editor;
}

export function BubbleMenuButtonGroup({editor}: Props) {
  return (
    <>
      <BubbleMenuButton
        className="rounded-l-md border-r-0"
        onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
        isActive={editor.isActive('heading', {level: 2})}
      >
        H2
      </BubbleMenuButton>
      <BubbleMenuButton
        className="border-r-0"
        onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
        isActive={editor.isActive('heading', {level: 3})}
      >
        H3
      </BubbleMenuButton>
      <BubbleMenuButton
        className="border-r-0"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
      >
        Bold
      </BubbleMenuButton>
      <BubbleMenuButton
        className="border-r-0"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
      >
        Italic
      </BubbleMenuButton>
      <BubbleMenuButton
        className="border-r-0"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
      >
        Strike
      </BubbleMenuButton>
      <BubbleMenuButton
        className="rounded-r-md"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
      >
        Bullet List
      </BubbleMenuButton>
    </>
  );
}
