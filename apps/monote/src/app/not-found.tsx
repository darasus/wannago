import Link from 'next/link';
import {Button, Container} from 'ui';
import {Ban} from 'lucide-react';

export default function NotFound() {
  return (
    <Container maxSize="sm">
      <div className="flex flex-col items-center gap-2 justify-center">
        <Ban className="w-10 h-10" />
        <h2>Not Found</h2>
        <div />
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </Container>
  );
}
