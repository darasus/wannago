import {Badge} from '../Badge/Badge';
import {cn} from 'utils';
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogTrigger,
} from '../Dialog/Dialog';
import {ReactNode} from 'react';

interface Props {
  className?: string;
  text: ReactNode;
  children: React.ReactNode;
  color: 'green' | 'red' | 'blue' | 'yellow';
}

export function BadgeWithModal({className, text, children, color}: Props) {
  return (
    <Dialog>
      <DialogTrigger>
        <div className={cn('inline-flex', className)}>
          <Badge
            className={cn({
              'bg-green-300 hover:bg-green-300 border-2 border-primary text-primary':
                color === 'green',
              'bg-red-300 hover:bg-red-300 border-2 border-primary text-primary':
                color === 'red',
              'bg-blue-300 hover:bg-blue-300 border-2 border-primary text-primary':
                color === 'blue',
              'bg-yellow-300 hover:bg-yellow-300 border-2 border-primary text-primary':
                color === 'yellow',
            })}
          >
            {children}
          </Badge>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogDescription>{text}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
