'use client';

import {useEffect, useRef} from 'react';
import {useEditor, EditorContent} from '@tiptap/react';
import {TiptapExtensions} from './extensions';
import {useDebouncedCallback} from 'use-debounce';
import {useCompletion} from 'ai/react';
import {toast} from 'sonner';
import {EditorBubbleMenu} from './components';
import {getPrevText} from './utils/getPrevText';
import {TiptapEditorProps} from './props';
import {inputClassName} from '../../Input/Input';
import {cn} from 'utils';

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
    onUpdate: (e) => {
      const selection = e.editor.state.selection;
      const lastTwo = getPrevText(e.editor, {
        chars: 2,
      });
      if (lastTwo === '++' && !isLoading) {
        e.editor.commands.deleteRange({
          from: selection.from - 2,
          to: selection.from,
        });
        complete(
          getPrevText(e.editor, {
            chars: 5000,
          })
        );
        // complete(e.editor.storage.markdown.getMarkdown());
      } else {
        debouncedUpdates(e);
      }
    },
  });

  const {complete, completion, isLoading, stop} = useCompletion({
    id: 'novel',
    api: '/api/generate',
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const prev = useRef('');

  // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff);
  }, [isLoading, editor, completion]);

  useEffect(() => {
    // if user presses escape or cmd + z and it's loading,
    // stop the request, delete the completion, and insert back the "++"
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || (e.metaKey && e.key === 'z')) {
        stop();
        if (e.key === 'Escape') {
          editor?.commands.deleteRange({
            from: editor.state.selection.from - completion.length,
            to: editor.state.selection.from,
          });
        }
        editor?.commands.insertContent('++');
      }
    };
    const mousedownHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      stop();
      if (window.confirm('AI writing paused. Continue?')) {
        complete(editor?.getText() || '');
      }
    };
    if (isLoading) {
      document.addEventListener('keydown', onKeyDown);
      window.addEventListener('mousedown', mousedownHandler);
    } else {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', mousedownHandler);
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', mousedownHandler);
    };
  }, [stop, isLoading, editor, complete, completion.length]);

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
          className={cn(
            'border-none',
            'prose',
            'text-md',
            'prose-h1:m-0 prose-h2:m-0 prose-h3:m-0',
            'prose-p:m-0',
            'prose-ul:m-0',
            'prose-li:m-0'
          )}
          editor={editor}
        />
      </div>
    </div>
  );
}
