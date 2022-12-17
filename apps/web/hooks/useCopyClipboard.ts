import {useState, useEffect} from 'react';
import copy from 'copy-to-clipboard';

interface Options {
  successDuration?: number;
}

export default function useCopyClipboard(
  text: string,
  options?: Options
): [boolean, () => void] {
  const [isCopied, setIsCopied] = useState(false);
  const successDuration = options?.successDuration || 3000;

  useEffect(() => {
    if (isCopied && successDuration) {
      const id = setTimeout(() => {
        setIsCopied(false);
      }, successDuration);

      return () => {
        clearTimeout(id);
      };
    }
  }, [isCopied, successDuration]);

  return [
    isCopied,
    () => {
      const didCopy = copy(text);
      setIsCopied(didCopy);
    },
  ];
}
