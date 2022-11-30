import Head from 'next/head';
import {useRouter} from 'next/router';
import {Button} from '../components/Button/Button';

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>WannaGo</title>
      </Head>
      <div>
        <div>Home page</div>
        <Button onClick={() => router.push('/dashboard')}>
          Go to dashboard
        </Button>
      </div>
    </>
  );
}
