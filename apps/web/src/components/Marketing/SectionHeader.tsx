import {titleFontClassName} from '../../fonts';
import {cn} from 'utils';

interface Props {
  title: string;
  description: string | JSX.Element;
  id?: string;
}

export function SectionHeader({title, description, id}: Props) {
  return (
    <div className="mx-auto text-center mb-16 max-w-4xl">
      <h2
        id={id}
        className={cn(
          'font-black text-3xl tracking-tight sm:text-7xl',
          titleFontClassName
        )}
      >
        {title}
      </h2>
      <p className="mt-4 font-medium text-xl tracking-tight">{description}</p>
    </div>
  );
}
