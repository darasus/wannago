import {SignIn} from 'auth-features';
import {Container} from 'ui';

export const metadata = {
  title: 'Sign in | WannaGo',
};

export const runtime = 'edge';
export const preferredRegion = 'iad1';

export default function LoginPage() {
  return (
    <Container maxSize="xs">
      <SignIn />
    </Container>
  );
}
