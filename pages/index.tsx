import {useRouter} from 'next/router';

export default function HomePage() {
  const router = useRouter();

  return (
    <div>
      <button onClick={() => router.push('/dashboard')}>Go to dashboard</button>
      <div>Home page</div>
    </div>
  );
}
