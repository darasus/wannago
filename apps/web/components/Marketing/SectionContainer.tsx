import {cn} from 'browser-utils';

interface Props extends React.PropsWithChildren {
  className?: string;
  id?: string;
}

export function SectionContainer({children, className, id}: Props) {
  return (
    <section
      id={id}
      className={cn('pt-20 pb-14 sm:pb-20 sm:pt-32 lg:pb-32 ', className)}
    >
      {children}
    </section>
  );
}
