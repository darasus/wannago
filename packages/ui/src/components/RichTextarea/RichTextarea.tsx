import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {EditorContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {HTMLAttributes, useEffect} from 'react';
import {FieldError, useFormContext} from 'react-hook-form';
import {cn} from 'utils';
import {Form} from '../../../../../apps/web/src/features/EventForm/types';
import {EditorMenu} from './EditorMenu';
import {inputClassName} from '../Input/Input';

interface Props extends HTMLAttributes<HTMLInputElement> {
  label?: string;
  additionalEditorMenu?: React.ReactNode;
  error?: FieldError;
  dataTestId?: string;
  isOptional?: boolean;
  isGenerating?: boolean;
  value?: string;
}

export function RichTextarea({
  label,
  error,
  dataTestId,
  isOptional,
  additionalEditorMenu,
  isGenerating,
  value,
  ...props
}: Props) {
  const {
    formState: {defaultValues},
    setValue,
  } = useFormContext<Form>();

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
    if (isGenerating && value) {
      editor?.commands.setContent(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div
      className={cn(
        'flex flex-col border-2 gap-y-2 rounded-3xl py-2 px-3 max-w-full min-h-[200px]',
        inputClassName,
        'h-auto'
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
        onSubmit={(e) => {
          e.preventDefault();
        }}
      />
    </div>
  );
}
