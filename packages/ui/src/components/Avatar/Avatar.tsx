import Image from 'next/image';
import {ComponentProps} from 'react';
import {cloudflareImageLoader, cn} from 'utils';

interface Props extends ComponentProps<typeof Image> {
  className?: string;
  imageClassName?: string;
  height?: number;
  width?: number;
  src: string;
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
        'isolate flex h-10 w-10 -space-x-1 overflow-hidden',
        className
      )}
    >
      <Image
        {...props}
        loader={cloudflareImageLoader}
        className={cn(
          'block h-full w-full rounded-full border-2 border-gray-800',
          imageClassName
        )}
        src={src}
        width={width}
        height={height}
        alt={alt}
      />
    </div>
  );
}
