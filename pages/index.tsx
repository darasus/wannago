import {useRouter} from 'next/router';
import {Button} from '../components/Button/Button';

export default function HomePage() {
  const router = useRouter();

  return (
    <div>
      <div>Home page</div>
      <Button onClick={() => router.push('/dashboard')}>Go to dashboard</Button>
    </div>
  );
}
