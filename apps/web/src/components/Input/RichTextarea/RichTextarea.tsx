import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {EditorContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {forwardRef, HTMLAttributes, useEffect} from 'react';
import {FieldError, useFormContext} from 'react-hook-form';
import {cn} from 'utils';
import {Form} from '../../../features/EventForm/types';
import {InputWrapper} from '../Input/InputWrapper';
import {EditorMenu} from './EditorMenu';

interface Props extends HTMLAttributes<HTMLInputElement> {
  label?: string;
  additionalEditorMenu?: React.ReactNode;
  error?: FieldError;
  dataTestId?: string;
  isOptional?: boolean;
  isGenerating?: boolean;
}

export const RichTextarea = forwardRef<HTMLInputElement, Props>(
  function RichTextarea(
    {
      label,
      error,
      dataTestId,
      isOptional,
      additionalEditorMenu,
      isGenerating,
      ...props
    },
    ref
  ) {
    const {
      formState: {defaultValues},
      setValue,
      watch,
    } = useFormContext<Form>();

    const value = watch('description');

    const editor = useEditor({
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
          protocols: ['http', 'https', 'mailto'],
        }),
        Placeholder.configure({
          placeholder: props.placeholder,
        }),
      ],
      content: defaultValues?.description || '',
      onUpdate: ({editor}) => {
        if (editor?.isEmpty) {
          setValue('description', '');
        } else {
          setValue('description', editor.getHTML());
        }
      },
    });

    useEffect(() => {
      if (isGenerating) {
        editor?.commands.setContent(value);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
      <>
        <InputWrapper
          label={label}
          error={error}
          data-testid={dataTestId}
          isOptional={isOptional}
        >
          <input ref={ref} {...props} className="hidden" />
          <div
            className={cn(
              'flex flex-col border-2 gap-y-2 rounded-3xl py-2 px-3 max-w-full min-h-[200px]',
              {
                '!ring-1 !border-2 !border-gray-500 !ring-gray-500':
                  editor?.isFocused,
                'border-gray-300': !error,
                'border-red-300': error,
                'border-brand-500 ring-brand-500': editor?.isFocused && !!error,
                'border-red-500 ring-red-500': editor?.isFocused && error,
              }
            )}
          >
            {editor && (
              <EditorMenu
                editor={editor}
                additionalEditorMenu={additionalEditorMenu}
              />
            )}
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
              onSubmit={e => {
                e.preventDefault();
              }}
            />
          </div>
        </InputWrapper>
      </>
    );
  }
);
