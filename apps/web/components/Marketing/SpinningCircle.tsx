import {motion} from 'framer-motion';
import {useRef, useState, useLayoutEffect} from 'react';
import {CircleBackground} from './CircleBackground';

export default function SpinningCircle() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div
      ref={ref}
      className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex justify-center items-center"
    >
      <div style={{height, width: '100%'}}>
        <motion.div
          style={{transformOrigin: 'center'}}
          initial={{rotate: 0}}
          animate={{rotate: 360}}
          transition={{
            repeat: Infinity,
            duration: 5,
            repeatType: 'loop',
            ease: 'linear',
          }}
        >
          <CircleBackground height={height * 0.7} width={height * 0.7} />
        </motion.div>
      </div>
    </div>
  );
}
