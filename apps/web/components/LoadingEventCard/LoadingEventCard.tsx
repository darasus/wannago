import {CardBase} from '../CardBase/CardBase';

export function LoadingEventCard() {
  return (
    <CardBase className="animate-pulse flex flex-col">
      <div className="grow overflow-hidden relative justify-center bg-gray-200 rounded-3xl aspect-video mb-4" />
      <div>
        <div className="h-3 bg-gray-200 rounded col-span-2 mb-2" />
        <div className="h-3 bg-gray-200 rounded col-span-2" />
      </div>
    </CardBase>
  );
}