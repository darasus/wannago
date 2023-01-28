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

    return (
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={value.text}
            className="bg-slate-700 rounded-full px-6 py-2 box-content"
            initial={{
              width: 0,
            }}
            animate={{
              width: 'auto',
              transition: {
                width: {
                  duration: 0.4,
                },
              },
            }}
            exit={{
              width: 0,
              transition: {
                width: {
                  duration: 0.4,
                  delay: 0.5,
                },
              },
            }}
          >
            <motion.span
              className="block text-2xl lg:text-5xl text-slate-50 lg:leading-[70px] lg:-mt-[8px] whitespace-nowrap"
              key={value.text}
              style={{opacity: 1}}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{
                opacity: 0,
                transition: {
                  delay: 0,
                },
              }}
              transition={{
                duration: 1,
                delay: 0.5,
              }}
            >
              {value.text}
            </motion.span>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  },
  () => false
);
