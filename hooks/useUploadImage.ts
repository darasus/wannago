import {Event} from '@prisma/client';
import axios from 'axios';
import {useCallback, useState} from 'react';
import {Form} from '../components/EventForm/types';
import {api, getBaseUrl} from '../lib/api';
import {useFetch} from './useFetch';

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

  return axios({
    url: `${getBaseUrl()}/api/uploadImage`,
    method: 'POST',
    data: payload,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(res => res.data)
    .then(({result}) => {
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
