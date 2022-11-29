import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import {useFormContext} from 'react-hook-form';
import {Form} from '../EventForm/types';
import {BubbleMenuButton} from './BubbleMenuButton';
import {BubbleMenuButtonGroup} from './BubbleMenuButtonGroup';

interface Props {
  label?: string;
}

export function RichTextarea({label}: Props) {
  const {
    formState: {defaultValues},
    setValue,
  } = useFormContext<Form>();

  const editor = useEditor({
    extensions: [StarterKit],
    content: defaultValues?.description || '',
    onUpdate: ({editor}) => {
      setValue('description', editor?.getHTML());
    },
  });

  return (
    <>
      {editor && (
        <BubbleMenu
          className="isolate inline-flex rounded-md shadow-sm"
          tippyOptions={{duration: 100}}
          editor={editor}
        >
          <BubbleMenuButtonGroup editor={editor} />
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu
          className=""
          tippyOptions={{duration: 100}}
          editor={editor}
        >
          <BubbleMenuButtonGroup editor={editor} />
        </FloatingMenu>
      )}
      <div>
        {label && (
          <label
            className={clsx('block text-md text-black mb-1 ml-2 font-bold')}
          >
            {label}
          </label>
        )}
        <div className="border border-gray-300 rounded-md">
          <div className="text-boty">
            <EditorContent
              editor={editor}
              onSubmit={e => {
                e.preventDefault();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
