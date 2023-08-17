import {cn} from 'utils';

interface Props {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'error' | 'info';
}

export function Banner({children, variant}: Props) {
  return (
    <div
      className={cn('rounded-lg border gap-1 px-4 py-2 text-sm', {
        'bg-green-400/20 hover:bg-green-400/20 text-green-300 border-green-600/20':
          variant === 'success',
        'bg-red-400/20 hover:bg-red-400/20 text-red-300 border-red-600/20':
          variant === 'error',
        'bg-yellow-400/20 hover:bg-yellow-400/20 text-yellow-300 border-yellow-600/20':
          variant === 'warning',
        'bg-blue-400/20 hover:bg-blue-400/20 text-blue-300 border-blue-600/20':
          variant === 'info',
      })}
    >
      {children}
    </div>
  );
}
