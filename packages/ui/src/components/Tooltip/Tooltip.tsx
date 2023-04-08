import {memo} from 'react';
import {cn} from '../../../../utils';

export interface TooltipProps {
  children: React.ReactNode;
  text?: string;
}

export const Tooltip: React.FC<TooltipProps> = memo(function Tooltip({
  children,
  text,
}) {
  return (
    <span className="group relative">
      {text && (
        <span
          className={cn(
            'pointer-events-none z-[9999]',
            'absolute -top-7 left-1/2 -translate-x-1/2',
            'px-2 py-1',
            'whitespace-nowrap rounded bg-gray-800 text-gray-50 text-xs',
            "before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-black before:content-['']",
            'opacity-0 transition group-hover:opacity-100'
          )}
        >
          {text}
        </span>
      )}
      {children}
    </span>
  );
});
