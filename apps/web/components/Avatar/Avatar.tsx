import clsx from 'clsx';
import Image from 'next/image';

interface Props {
  images: string[];
  className?: string;
}

export function Avatar({images, className}: Props) {
  return (
    <div className={clsx('isolate flex -space-x-1 overflow-hidden', className)}>
      {images.map(imageSrc => {
        return (
          <Image
            className="relative z-30 inline-block h-6 w-6 rounded-full ring-2 ring-white"
            key={imageSrc}
            src={imageSrc}
            width={50}
            height={50}
            alt=""
          />
        );
      })}
    </div>
  );
}