import Image from 'next/image';
import {ComponentProps} from 'react';
import {cloudflareImageLoader, cn} from 'utils';
import {UserIcon} from '@heroicons/react/24/outline';

interface Props extends Omit<ComponentProps<typeof Image>, 'src'> {
  className?: string;
  imageClassName?: string;
  height?: number;
  width?: number;
  src?: string | null;
}

export function Avatar({
  src,
  className,
  imageClassName,
  height = 50,
  width = 50,
  alt,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        'relative isolate flex h-10 w-10 -space-x-1 overflow-hidden aspect-square',
        className
      )}
    >
      {src ? (
        <Image
          {...props}
          loader={cloudflareImageLoader}
          className={cn(
            'block h-full w-full rounded-full border-2 border-gray-800',
            imageClassName
          )}
          fill
          style={{objectFit: 'cover'}}
          src={src}
          alt={alt}
        />
      ) : (
        <div className="flex items-center justify-center h-full w-full border-2 border-gray-800 rounded-full bg-slate-200">
          <UserIcon className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}
