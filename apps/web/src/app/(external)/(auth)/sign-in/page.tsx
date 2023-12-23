import {SignIn} from 'auth-features';
import {revalidatePath} from 'next/cache';
import {Container} from 'ui';

export const metadata = {
  title: 'Sign in | WannaGo',
};

export default function LoginPage() {
  return (
    <Container maxSize="xs">
      <SignIn
        onDone={async () => {
          'use server';

          revalidatePath('/', 'layout');
        }}
      />
    </Container>
  );
}
