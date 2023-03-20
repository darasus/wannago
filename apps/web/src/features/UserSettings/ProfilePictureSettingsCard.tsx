import NextImage from 'next/image';
import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {cn} from 'utils';
import {Button, CardBase, Spinner} from 'ui';
import {InputWrapper} from '../../components/Input/Input/InputWrapper';
import {toast} from 'react-hot-toast';
import {captureException} from '@sentry/nextjs';
import {useMe} from 'hooks';

export function ProfilePictureSettingsCard() {
  const {clerkMe} = useMe();
  const [isLoading, setIsLoading] = useState(false);
  const hasImage = clerkMe?.profileImageUrl.includes('gravatar') ? false : true;

  const onDrop = useCallback(
    async (droppedFiles: File[]) => {
      try {
        setIsLoading(true);
        const file = droppedFiles[0];
        await clerkMe?.setProfileImage({file});
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error('Something went wrong. Please try again.');
        captureException(error);
      }
    },
    [clerkMe]
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

  const handleRemoveImage = useCallback(async () => {
    await clerkMe?.setProfileImage({file: null});
  }, [clerkMe]);

  return (
    <CardBase>
      <InputWrapper label="Profile picture">
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
          {isLoading && (
            <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center bg-gray-100">
              <Spinner />
            </div>
          )}
          {!isLoading && hasImage && clerkMe?.profileImageUrl && (
            <>
              <div className="flex items-center justify-center absolute w-full h-full bg-gray-100">
                <NextImage
                  data-testid="file-input-image-preview"
                  alt=""
                  src={clerkMe?.profileImageUrl}
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
    </CardBase>
  );
}
