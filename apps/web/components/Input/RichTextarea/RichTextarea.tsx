import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import {forwardRef, HTMLAttributes, useEffect} from 'react';
import {FieldError, useFormContext} from 'react-hook-form';
import {Form} from '../../EventForm/types';
import {InputWrapper} from '../Input/InputWrapper';
import {BubbleMenuButtonGroup} from './BubbleMenuButtonGroup';

interface Props extends HTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
}

export const RichTextarea = forwardRef<HTMLInputElement, Props>(
  function RichTextarea({label, error, ...props}, ref) {
    const {
      formState: {defaultValues},
      setValue,
      watch,
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
        <InputWrapper label={label} error={error}>
          <input ref={ref} {...props} className="hidden" />
          <EditorContent
            className={clsx(
              'border-2 rounded-3xl p-2',
              'prose',
              'prose-h1:m-0 prose-h2:m-0 prose-h3:m-0',
              'prose-p:m-0',
              'prose-ul:m-0',
              'prose-li:m-0',
              {
                'input-focus': editor?.isFocused,
                'border-gray-300': !error,
                'border-red-300': error,
                'border-brand-500 ring-brand-500': editor?.isFocused && !!error,
                'border-red-500 ring-red-500': editor?.isFocused && error,
              }
            )}
            editor={editor}
            onSubmit={e => {
              e.preventDefault();
            }}
          />
        </InputWrapper>
      </>
    );
  }
);
