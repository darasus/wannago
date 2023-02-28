import {ChangeEvent, ComponentProps, forwardRef, useState} from 'react';
import {useUploadImage} from 'hooks';
import {Button, Spinner} from 'ui';
import {Input} from '../Input/Input';
import {PhotoIcon} from '@heroicons/react/24/outline';
import Image from 'next/image';
import {useFormContext} from 'react-hook-form';
import {Form} from '../../../features/EventForm/types';

interface Props extends ComponentProps<typeof Input> {}

export const FileInput = forwardRef<HTMLInputElement, Props>(function FileInput(
  props,
  ref
) {
  const {
    formState: {defaultValues},
    setValue,
  } = useFormContext<Form>();
  const [imageSrc, setImageSrc] = useState<string | null>(
    defaultValues?.featuredImageSrc || null
  );

  const {isLoading, handleFileUpload} = useUploadImage();

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file).then(data => {
        if (data) {
          setImageSrc(data.url);
          setValue('featuredImageSrc', data.url);
          setValue('featuredImageHeight', data.height);
          setValue('featuredImageWidth', data.width);
          setValue('featuredImagePreviewSrc', data.imageSrcBase64);
        }
      });
    }
  };

  return (
    <div>
      <Input
        ref={ref}
        {...props}
        type="text"
        value={imageSrc || ''}
        inputClassName="hidden"
      />
      <Input
        data-testid="file-input"
        onChange={handleFileInputChange}
        type="file"
        id="button-upload"
        containerClassName="hidden"
      />
      <div className="relative flex justify-center items-center border-2 border-dashed border-gray-300 rounded-3xl bg-gray-100 mb-4 text-gray-400 aspect-video overflow-hidden">
        {!isLoading && !imageSrc && (
          <div>
            <PhotoIcon />
            <span>Image preview</span>
          </div>
        )}
        {isLoading && <Spinner />}
        {!isLoading && imageSrc && (
          <Image
            data-testid="file-input-image-preview"
            alt=""
            src={imageSrc}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="flex justify-center">
        <Button as="label" htmlFor="button-upload" variant="neutral">
          Upload image
        </Button>
      </div>
    </div>
  );
});
