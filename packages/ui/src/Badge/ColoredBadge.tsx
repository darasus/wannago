import {cn} from 'utils';
import {Badge} from './Badge';

interface Props {
  color:
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
  children: React.ReactNode;
}

export function ColoredBadge({color, children}: Props) {
  return (
    <Badge
      className={cn('inline-flex border gap-1 py-1.5 font-normal', {
        'bg-green-400/20 hover:bg-green-400/20 text-green-300 border-green-600/20':
          color === 'green',
        'bg-red-400/20 hover:bg-red-400/20 text-red-300 border-red-600/20':
          color === 'red',
        'bg-yellow-400/20 hover:bg-yellow-400/20 text-yellow-300 border-yellow-600/20':
          color === 'yellow',
        'bg-blue-400/20 hover:bg-blue-400/20 text-blue-300 border-blue-600/20':
          color === 'blue',
        'bg-purple-400/20 hover:bg-purple-400/20 text-purple-300 border-purple-600/20':
          color === 'purple',
        'bg-teal-400/20 hover:bg-teal-400/20 text-teal-300 border-teal-600/20':
          color === 'teal',
        'bg-pink-400/20 hover:bg-pink-400/20 text-pink-300 border-pink-600/20':
          color === 'pink',
        'bg-orange-400/20 hover:bg-orange-400/20 text-orange-300 border-orange-600/20':
          color === 'orange',
        'bg-lime-400/20 hover:bg-lime-400/20 text-lime-300 border-lime-600/20':
          color === 'lime',
        'bg-grey-400/20 hover:bg-grey-400/20 text-grey-300 border-grey-600/20':
          color === 'default',
      })}
    >
      {children}
    </Badge>
  );
}
