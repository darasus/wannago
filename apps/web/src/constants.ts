import {HTMLMotionProps} from 'framer-motion';

export const REMINDER_PERIOD_IN_SECONDS = 60 * 60 * 3; // 3 hours
export const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export const animateRenderProps: HTMLMotionProps<'div'> = {
  initial: {opacity: 0},
  animate: {opacity: 1},
  exit: {opacity: 0},
};
