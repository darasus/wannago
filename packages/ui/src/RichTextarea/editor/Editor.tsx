'use client';

import {useEditor, EditorContent} from '@tiptap/react';
import {TiptapExtensions} from './extensions';
import {useDebouncedCallback} from 'use-debounce';
import {EditorBubbleMenu} from './components';
import {TiptapEditorProps} from './props';
import {inputClassName} from '../../Input/Input';
import {cn} from 'utils';
import {proseClassName} from 'const';

interface Props {
  dataTestId?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function Editor({value, onChange, dataTestId}: Props) {
  const debouncedUpdates = useDebouncedCallback(async ({editor}) => {
    if (editor?.isEmpty) {
      onChange?.('');
    } else {
      onChange?.(editor.getHTML());
    }
  }, 750);

  const editor = useEditor({
    extensions: TiptapExtensions,
    editorProps: TiptapEditorProps,
    content: value,
  });

  return (
    <div
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className={cn(
        inputClassName,
        'flex flex-col gap-y-2 p-2 max-w-full',
        'h-auto'
      )}
    >
      {editor && <EditorBubbleMenu editor={editor} />}
      <div
        onClick={() => {
          editor?.chain().focus().run();
        }}
        className="min-h-[200px]"
      >
        <EditorContent
          data-testid={dataTestId}
          className={cn('border-none', proseClassName)}
          editor={editor}
        />
      </div>
    </div>
  );
}
