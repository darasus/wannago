'use client';

import {useEffect, useRef, useState} from 'react';
import {useEditor, EditorContent, JSONContent, Extension} from '@tiptap/react';
import {defaultEditorProps} from './props';
import {defaultExtensions} from './extensions';
import {useDebouncedCallback} from 'use-debounce';
import {useCompletion} from 'ai/react';
import {toast} from 'sonner';
import va from '@vercel/analytics';
import {defaultEditorContent} from './default-content';
import {EditorBubbleMenu} from './components/EditorBubbleMenu';
import {ImageResizer} from './extensions/image-resizer';
import {EditorProps} from '@tiptap/pm/view';
import {Editor as EditorClass} from '@tiptap/core';
import {useLocalStorage} from '../../lib/hooks/use-local-storage';
import {getPrevText} from '../../lib/editor';
import {textFont} from '../../styles/fonts';
import {ColoredBadge} from 'ui';
import Menu from '../../../ui/menu';

export function Editor({
  completionApi = '/api/generate',
  defaultValue = defaultEditorContent,
  extensions = [],
  editorProps = {},
  onUpdate = () => {},
  onDebouncedUpdate = () => {},
  debounceDuration = 750,
  storageKey = 'novel__content',
}: {
  /**
   * The API route to use for the OpenAI completion API.
   * Defaults to "/api/generate".
   */
  completionApi?: string;
  /**
   * Additional classes to add to the editor container.
   * Defaults to "relative min-h-[500px] w-full bg-background".
   */
  className?: string;
  /**
   * The default value to use for the editor.
   * Defaults to defaultEditorContent.
   */
  defaultValue?: JSONContent | string;
  /**
   * A list of extensions to use for the editor, in addition to the default Novel extensions.
   * Defaults to [].
   */
  extensions?: Extension[];
  /**
   * Props to pass to the underlying Tiptap editor, in addition to the default Novel editor props.
   * Defaults to {}.
   */
  editorProps?: EditorProps;
  /**
   * A callback function that is called whenever the editor is updated.
   * Defaults to () => {}.
   */
  // eslint-disable-next-line no-unused-vars
  onUpdate?: (editor?: EditorClass) => void | Promise<void>;
  /**
   * A callback function that is called whenever the editor is updated, but only after the defined debounce duration.
   * Defaults to () => {}.
   */
  // eslint-disable-next-line no-unused-vars
  onDebouncedUpdate?: (editor?: EditorClass) => void | Promise<void>;
  /**
   * The duration (in milliseconds) to debounce the onDebouncedUpdate callback.
   * Defaults to 750.
   */
  debounceDuration?: number;
  /**
   * The key to use for storing the editor's value in local storage.
   * Defaults to "novel__content".
   */
  storageKey?: string;
}) {
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [content, setContent] = useLocalStorage(storageKey, defaultValue);

  const [hydrated, setHydrated] = useState(false);

  const debouncedUpdates = useDebouncedCallback(async ({editor}) => {
    const json = editor.getJSON();
    setContent(json);
    onDebouncedUpdate(editor);
    setSaveStatus('Saving...');
    // Simulate a delay in saving.
    setTimeout(() => {
      setSaveStatus('Saved');
    }, 500);
  }, debounceDuration);

  const editor = useEditor({
    extensions: [...defaultExtensions, ...extensions],
    editorProps: {
      ...defaultEditorProps,
      ...editorProps,
    },
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
        va.track('Autocomplete Shortcut Used');
      } else {
        onUpdate(e.editor);
        setSaveStatus('Unsaved');
        debouncedUpdates(e);
      }
    },
    autofocus: 'end',
  });

  const {complete, completion, isLoading, stop} = useCompletion({
    id: 'novel',
    api: completionApi,
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });
    },
    onError: (err) => {
      toast.error(err.message);
      if (err.message === 'You have reached your request limit for the day.') {
        va.track('Rate Limit Reached');
      }
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

  // Hydrate the editor with the content from localStorage.
  useEffect(() => {
    if (editor && content && !hydrated) {
      editor.commands.setContent(content);
      setHydrated(true);
    }
  }, [editor, content, hydrated]);

  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-0 left-0 right-0 z-10">
        {editor && (
          <EditorBubbleMenu
            editor={editor}
            right={
              <div className="flex items-center gap-2">
                <ColoredBadge
                  color={saveStatus !== 'Saved' ? 'default' : 'green'}
                  className="py-0.5"
                >
                  {saveStatus}
                </ColoredBadge>
                <Menu />
              </div>
            }
          />
        )}
      </div>
      <div
        onClick={() => {
          editor?.chain().focus().run();
        }}
        className={`relative min-h-[500px] w-full bg-background px-4 ${textFont.className}`}
      >
        {editor?.isActive('image') && <ImageResizer editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
