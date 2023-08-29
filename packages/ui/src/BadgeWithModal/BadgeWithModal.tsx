import {cn} from 'utils';
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogTrigger,
} from '../Dialog/Dialog';
import {ReactNode} from 'react';
import {ColoredBadge} from '../Badge/ColoredBadge';

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
          <ColoredBadge className="py-1" color={color}>
            {children}
          </ColoredBadge>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogDescription>{text}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
