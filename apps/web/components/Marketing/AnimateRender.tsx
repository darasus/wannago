import {AnimatePresence, motion} from 'framer-motion';
import {PropsWithChildren} from 'react';

interface AnimateRenderProps extends PropsWithChildren {
  delay?: number;
}

export function AnimateRender({children, delay}: AnimateRenderProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="card-container"
        initial={{
          y: 100,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            bounce: 0.4,
            duration: 1.5,
            delay,
          },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
