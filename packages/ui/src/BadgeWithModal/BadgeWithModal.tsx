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
        <div className={cn('inline-flex bg-background rounded-lg', className)}>
          <Badge
            className={cn('border text-primary', {
              'bg-green-400/20 border-green-600/20 border-green-600/20':
                color === 'green',
              'bg-red-400/20 hover:bg-red-600/20 border-red-600/20':
                color === 'red',
              'bg-blue-400/20 hover:bg-blue-600/20 border-blue-600/20':
                color === 'blue',
              'bg-yellow-400/20 hover:bg-yellow-600/20 border-yellow-600/20':
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
