import {CardBase} from '../CardBase/CardBase';

export function LoadingEventCard() {
  return (
    <CardBase className="animate-pulse flex flex-col p-0">
      <div className="grow overflow-hidden relative justify-center bg-slate-500 rounded-t-xl aspect-video" />
      <div className="p-4">
        <div className="h-3 bg-slate-500 rounded col-span-2 mb-2" />
        <div className="h-3 bg-slate-500 rounded col-span-2" />
      </div>
    </CardBase>
  );
}
