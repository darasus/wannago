import Image from 'next/image';
import {ComponentProps} from 'react';
import {cn} from 'utils';
import {User} from 'lucide-react';

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
  const canRenderImage = src?.includes('gravatar') ? null : true;

  return (
    <div
      className={cn(
        'relative isolate flex h-10 w-10 -space-x-1 overflow-hidden aspect-square',
        className
      )}
    >
      {canRenderImage && src ? (
        <Image
          {...props}
          // loader={imageLoader}
          className={cn(
            'block h-full w-full rounded-full border',
            imageClassName
          )}
          fill
          sizes="320 640 750 1000"
          style={{objectFit: 'cover'}}
          src={src}
          alt={alt}
        />
      ) : (
        <div
          className={cn(
            'flex items-center justify-center h-full w-full border bg-muted dark:bg-white/[.04] rounded-full',
            imageClassName
          )}
        >
          <User className="h-2/3 w-2/4" />
        </div>
      )}
    </div>
  );
}
