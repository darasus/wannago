import {Separator} from 'ui';

interface Props {
  children: React.ReactNode;
  headerChildren?: React.ReactNode;
  title: string;
}

export function PageContainer({children, headerChildren, title}: Props) {
  return (
    <>
      <div className="flex items-center px-4 py-2 h-16">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="grow" />
        {headerChildren}
      </div>
      <Separator />
      <div className="p-4">{children}</div>
    </>
  );
}
