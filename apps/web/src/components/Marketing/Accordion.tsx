import * as React from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {ChevronDownIcon} from '@heroicons/react/24/solid';

interface Props {
  index: number;
  isExpanded: false | number;
  setExpanded: (value: false | number) => void;
  title: string | JSX.Element;
  content: string | JSX.Element;
}

export const Accordion = ({
  index,
  isExpanded,
  setExpanded,
  content,
  title,
}: Props) => {
  const isOpen = index === isExpanded;

  return (
    <div className="mb-2">
      <motion.header
        className="flex items-start text-xl cursor-pointer font-medium"
        initial={false}
        onClick={() => setExpanded(isOpen ? false : index)}
      >
        <motion.div
          className="flex items-center justify-center bg-gray-100 h-7 w-7 rounded-full mr-2 shrink-0"
          initial={false}
          animate={{rotate: isOpen ? '0deg' : '180deg'}}
        >
          <ChevronDownIcon className="h-5 w-5" />
        </motion.div>
        {title}
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: {opacity: 1, height: 'auto'},
              collapsed: {opacity: 0, height: 0},
            }}
            transition={{duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98]}}
          >
            <div className="py-4 ml-10">{content}</div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};
