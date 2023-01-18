import {AnimatePresence, motion} from 'framer-motion';
import {memo, useEffect, useMemo, useState} from 'react';

interface Props {
  texts: string[];
}

export const TextAnimation = memo(
  function TextAnimation({texts}: Props) {
    const values = useMemo(() => {
      return texts.map(text => {
        return {
          text,
          id: Math.random(),
        };
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [value, setValue] = useState<{text: string; id: number}>(values[0]);

    useEffect(() => {
      const interval = setInterval(() => {
        const index = values.indexOf(value);
        const nextIndex = index + 1;
        const nextValue = values[nextIndex % values.length];
        if (value.id !== nextValue.id) {
          setValue(nextValue);
        }
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }, [value, values]);

    const characters = useMemo(() => {
      return value.text.split('').map(character => {
        return {
          character,
          id: Math.random(),
        };
      });
    }, [value.text]);

    return (
      <span>
        <AnimatePresence mode="wait">
          <motion.div
            key={value.id}
            style={{opacity: 0}}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{
              duration: 0.2,
            }}
          >
            {characters.map(({character, id}, i) => {
              return (
                <AnimatePresence mode="wait" key={id}>
                  <motion.span
                    style={{opacity: 0}}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{
                      duration: 0.2,
                      delay: 0.1 * i,
                    }}
                  >
                    {character}
                  </motion.span>
                </AnimatePresence>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </span>
    );
  },
  () => false
);
