import Image from 'next/image';
import {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {FieldError} from 'react-hook-form';
import {Button} from 'ui';
import {cn} from 'utils';
import {InputWrapper} from 'ui';

interface Props {
  onChange: (file: File | null) => void;
  defaultValue?: string | null;
  error?: FieldError;
}

export function ImageInput({onChange, defaultValue, error}: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(defaultValue || null);

  const onDrop = useCallback(
    async (droppedFiles: File[]) => {
      const file = droppedFiles[0];
      onChange(file);
      const reader = new FileReader();
      reader.onload = function (e) {
        const src = e.target?.result;
        if (typeof src === 'string') {
          setImageSrc(src);
        }
      };
      reader.readAsDataURL(file);
    },
    [onChange]
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

  const handleRemove = useCallback(() => {
    setImageSrc(null);
    onChange(null);
  }, [onChange]);

  return (
    <InputWrapper label="Profile picture" error={error}>
      <div
        className={cn(
          'flex flex-col relative justify-center items-center border-2 border-dashed border-gray-300 rounded-3xl bg-gray-100 text-gray-400 aspect-video overflow-hidden',
          'focus:border-gray-500 focus:ring-gray-500',
          {'bg-gray-200': isDragActive}
        )}
      >
        <div {...getRootProps()} className={cn('h-full w-full')}>
          <input
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
        {imageSrc && (
          <>
            <div className="flex items-center justify-center absolute w-full h-full bg-gray-100">
              <Image
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
              onClick={handleRemove}
            >
              Remove
            </Button>
          </>
        )}
      </div>
    </InputWrapper>
  );
}
