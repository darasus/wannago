import {AnimatePresence, motion} from 'framer-motion';
import {useEffect, useState} from 'react';

interface Props {
  texts: string[];
}

export function TextAnimation({texts}: Props) {
  const [text, setText] = useState(texts[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const index = texts.indexOf(text);
      const nextIndex = index + 1;
      const nextText = texts[nextIndex % texts.length];
      if (text !== nextText) {
        setText(nextText);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [text, texts]);

  return (
    <span>
      <AnimatePresence mode="wait">
        {text.split('').map((character, i) => {
          return (
            <motion.span
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{
                duration: 0.2,
                delay: 0.1 * i,
              }}
              key={Math.random()}
            >
              {character}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </span>
  );
}
