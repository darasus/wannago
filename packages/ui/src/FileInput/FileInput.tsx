import NextImage from 'next/image';
import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {cn} from 'utils';
import {Button} from '../Button/Button';
import {Spinner} from '../Spinner/Spinner';
import {useUploadImage} from '../../../hooks/src/useUploadImage';

interface Value {
  src: string;
  imageSrcBase64: string;
  height: number;
  width: number;
}

interface Props {
  value: Value | null;
  onChange: (value: Value | null) => void;
}

export function FileInput({value, onChange, ...props}: Props) {
  const {isLoading, handleFileUpload} = useUploadImage();

  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      handleFileUpload(droppedFiles[0]).then((data) => {
        if (data) {
          const v = {
            height: data.height,
            width: data.width,
            src: data.url,
            imageSrcBase64: data.imageSrcBase64,
          };
          onChange?.(v);
        }
      });
    },
    [handleFileUpload, onChange]
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

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    onChange?.(null);
    e.preventDefault();
  };

  return (
    <div
      className={cn(
        'flex flex-col relative justify-center items-center border-dashed h-48 overflow-hidden',
        'rounded-md border border-input bg-background',
        {'bg-gray-200': isDragActive}
      )}
    >
      <div {...getRootProps()} className={cn('h-full w-full')}>
        <input multiple={false} {...getInputProps()} data-testid="file-input" />

        {!isLoading && !value?.src && (
          <div className="h-full flex flex-col justify-center items-center gap-y-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              Select file
            </Button>
            <span className="text-center">or just drop image here...</span>
          </div>
        )}
      </div>
      {isLoading && (
        <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
          <Spinner />
        </div>
      )}
      {!isLoading && value?.src && (
        <>
          <div className="flex items-center justify-center absolute w-full h-full ">
            <NextImage
              data-testid="file-input-image-preview"
              alt=""
              src={value?.src}
              fill
              style={{objectFit: 'contain'}}
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-5 right-5 z-50"
            onClick={handleRemoveImage}
          >
            Remove
          </Button>
        </>
      )}
    </div>
  );
}
