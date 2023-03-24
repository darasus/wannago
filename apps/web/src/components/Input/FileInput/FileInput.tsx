import {InputWrapper} from '../Input/InputWrapper';
import NextImage from 'next/image';
import React, {ComponentProps, forwardRef, useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {useFormContext} from 'react-hook-form';
import {Input} from '../Input/Input';
import {cn} from 'utils';
import {useUploadImage} from 'hooks';
import {Button, Spinner} from 'ui';

interface Props extends Omit<ComponentProps<typeof Input>, 'accept'> {
  name: string;
  isOptional?: boolean;
}

export const FileInput = forwardRef<HTMLInputElement, Props>(function FileInput(
  props: Props,
  ref
) {
  const {name, label, error, isOptional, ...rest} = props;
  const {
    setValue,
    formState: {defaultValues},
    resetField,
  } = useFormContext();
  const [imageSrc, setImageSrc] = useState<string | null>(
    defaultValues?.featuredImageSrc || defaultValues?.logoSrc || null
  );
  const {isLoading, handleFileUpload} = useUploadImage();

  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      handleFileUpload(droppedFiles[0]).then(data => {
        if (data) {
          setImageSrc(data.url);
          setValue(props.name, data.url);
          setValue('featuredImageHeight', data.height);
          setValue('featuredImageWidth', data.width);
          setValue('featuredImagePreviewSrc', data.imageSrcBase64);
        }
      });
    },
    [handleFileUpload, setValue, props.name]
  );

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
    },
  });

  const handleRemoveImage = () => {
    setImageSrc(null);
    setValue('featuredImageSrc', '');
  };

  return (
    <InputWrapper
      id={props.id}
      label={props.label}
      error={error}
      isOptional={isOptional}
    >
      <div
        className={cn(
          'flex flex-col relative justify-center items-center border-2 border-dashed border-gray-300 rounded-3xl bg-gray-100 text-gray-400 aspect-video overflow-hidden',
          'focus:border-gray-500 focus:ring-gray-500',
          {'bg-gray-200': isDragActive}
        )}
      >
        <div {...getRootProps()} className={cn('h-full w-full')}>
          <input ref={ref} value={imageSrc || ''} hidden readOnly />
          <input
            {...rest}
            name={name}
            id={name}
            multiple={false}
            {...getInputProps()}
            data-testid="file-input"
          />

          <div className="h-full flex flex-col justify-center items-center gap-y-2">
            <Button variant="neutral" size="sm">
              Select file
            </Button>
            <p className="text-center">or just drop image here...</p>
          </div>
        </div>
        {isLoading && (
          <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center bg-gray-100">
            <Spinner />
          </div>
        )}
        {!isLoading && imageSrc && (
          <>
            <div className="flex items-center justify-center absolute w-full h-full bg-gray-100">
              <NextImage
                data-testid="file-input-image-preview"
                alt=""
                src={imageSrc}
                fill
                style={{objectFit: 'contain'}}
              />
            </div>
            <Button
              variant="neutral"
              size="sm"
              className="absolute bottom-5 right-5 z-50"
              onClick={handleRemoveImage}
            >
              Remove
            </Button>
          </>
        )}
      </div>
    </InputWrapper>
  );
});
