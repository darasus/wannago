import {Spinner} from '../Spinner/Spinner';

export function LoadingBlock() {
  return (
    <div className="flex justify-center">
      <Spinner />
    </div>
  );
}
