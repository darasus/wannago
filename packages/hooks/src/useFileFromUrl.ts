import {useEffect, useState} from 'react';

export function useFileFromUrl(url: string | undefined | null) {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (url) {
      createFileFromURL(url).then(file => {
        if (file) {
          setFile(file);
        }
      });
    }
  }, [url]);

  return file;
}

async function createFileFromURL(url: string) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.blob();
    const file = new File([data], 'preview', {type: data.type});
    return file;
  } catch (error) {
    console.error('Error fetching the file:', error);
  }
}
