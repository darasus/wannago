import {ChevronDownIcon} from '@heroicons/react/24/solid';
import {motion, AnimatePresence} from 'framer-motion';
import {useState} from 'react';

interface Item {
  label: string;
  content: string | JSX.Element;
}

interface Props {
  items: Item[];
  defaultExpandedIndex?: number;
}

export function Accordion({items, defaultExpandedIndex}: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | false>(
    typeof defaultExpandedIndex === 'number' ? defaultExpandedIndex : false
  );

  return (
    <div className="flex flex-col gap-y-2">
      {items.map(({label, content}, i) => {
        const isExpanded = expandedIndex === i;

        return (
          <div key={i}>
            <motion.header
              className="flex"
              initial={false}
              onClick={() => setExpandedIndex(isExpanded ? false : i)}
            >
              <div className="flex items-center cursor-pointer font-medium bg-black/5 pl-3 pr-1 py-1 rounded-3xl">
                {label}
                <motion.div
                  className="flex items-center justify-center bg-black/10 h-7 w-7 rounded-full shrink-0 ml-2"
                  initial={false}
                  animate={{rotate: isExpanded ? '0deg' : '180deg'}}
                >
                  <ChevronDownIcon className="h-4 w-4 text-gray-800" />
                </motion.div>
              </div>
            </motion.header>
            <AnimatePresence>
              {isExpanded && (
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
                  <div className="text-gray-800 pt-2">{content}</div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
