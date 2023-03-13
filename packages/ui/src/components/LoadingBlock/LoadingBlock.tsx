import {motion} from 'framer-motion';
import {LoadingWave} from '../LoadingWave/LoadingWave';

export function LoadingBlock() {
  return (
    <motion.div
      className="flex justify-center"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
    >
      <LoadingWave />
    </motion.div>
  );
}
