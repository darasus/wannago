import ky from 'ky';
import {useCallback, useState} from 'react';
import {getBaseUrl} from '../utils/getBaseUrl';

interface FileUploadResponse {
  id: string;
  variants: string[];
}

interface Props {
  onSuccess?: (result: FileUploadResponse) => void;
}

const uploadFile = (file: File) => {
  const payload = new FormData();

  payload.append('requireSignedURLs', 'false');
  payload.append('file', file);

  return ky
    .post(`${getBaseUrl()}/api/uploadImage`, {
      body: payload,
    })
    .json()
    .then(({result}: any) => {
      return {id: result.id, variants: result.variants} as FileUploadResponse;
    });
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
