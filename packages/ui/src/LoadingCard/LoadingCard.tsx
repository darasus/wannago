import {CardBase} from '../CardBase/CardBase';
import {Skeleton} from '../Skeleton/Skeleton';

export function LoadingCard() {
  return (
    <CardBase
      title={<Skeleton className="h-4 w-[100px]" />}
      titleChildren={<Skeleton className="h-4 w-[100px]" />}
    >
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </CardBase>
  );
}
