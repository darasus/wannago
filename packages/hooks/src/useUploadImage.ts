'use client';

import ky from 'ky';
import {useCallback, useState} from 'react';
import {z} from 'zod';
import {getBaseUrl} from 'utils';

const schema = z.object({
  url: z.string().url(),
  imageSrcBase64: z.string(),
  height: z.number(),
  width: z.number(),
});

type FileUploadResponse = z.infer<typeof schema>;

interface Props {
  onSuccess?: (result: FileUploadResponse) => void;
}

const uploadFile = (file: File) => {
  const payload = new FormData();

  payload.append('requireSignedURLs', 'false');
  payload.append('file', file);

  return ky
    .post(`${getBaseUrl()}/api/image/upload`, {
      body: payload,
    })
    .json()
    .then((res) => schema.parse(res));
};

export function useUploadImage(props?: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsLoading(true);

      try {
        const event = await uploadFile(file);
        props?.onSuccess?.(event);
        return event;
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [props]
  );

  return {isLoading, handleFileUpload, error};
}
