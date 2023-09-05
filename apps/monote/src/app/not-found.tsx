import Link from 'next/link';
import {Ban} from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-2 justify-center">
      <Ban className="w-10 h-10" />
      <h2>Not Found</h2>
      <div />
      <Link href="/">Home</Link>
    </div>
  );
}
