import {cn} from 'utils';
import {Badge} from './Badge';
import {cva} from 'class-variance-authority';

export type Color =
  | 'green'
  | 'red'
  | 'yellow'
  | 'blue'
  | 'purple'
  | 'teal'
  | 'pink'
  | 'orange'
  | 'lime'
  | 'default';

interface Props {
  color?: Color;
  children: React.ReactNode;
  className?: string;
}

export const colorVariants = cva('', {
  variants: {
    intent: {
      green:
        'bg-green-400/20 hover:bg-green-400/30 text-green-600 dark:text-green-300 border-green-600/20',
      red: 'bg-red-400/20 hover:bg-red-400/30 text-red-600 dark:text-red-300 border-red-600/20',
      yellow:
        'bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-600 dark:text-yellow-300 border-yellow-600/20',
      blue: 'bg-blue-400/20 hover:bg-blue-400/30 text-blue-600 dark:text-blue-300 border-blue-600/20',
      purple:
        'bg-purple-400/20 hover:bg-purple-400/30 text-purple-600 dark:text-purple-300 border-purple-600/20',
      teal: 'bg-teal-400/20 hover:bg-teal-400/30 text-teal-600 dark:text-teal-300 border-teal-600/20',
      pink: 'bg-pink-400/20 hover:bg-pink-400/30 text-pink-600 dark:text-pink-300 border-pink-600/20',
      orange:
        'bg-orange-400/20 hover:bg-orange-400/30 text-orange-600 dark:text-orange-300 border-orange-600/20',
      lime: 'bg-lime-400/20 hover:bg-lime-400/30 text-lime-600 dark:text-lime-300 border-lime-600/20',
      default:
        'bg-grey-400/20 hover:bg-grey-400/30 text-grey-600 dark:text-grey-300 border-grey-600/20',
    },
  },
  defaultVariants: {
    intent: 'default',
  },
});

export function ColoredBadge({color, children, className}: Props) {
  return (
    <Badge
      className={cn(
        'inline-flex border gap-1 py-1.5 font-normal',
        colorVariants({intent: color}),
        className
      )}
    >
      {children}
    </Badge>
  );
}
