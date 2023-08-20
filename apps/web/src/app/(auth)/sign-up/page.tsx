import {SignUp} from 'auth-features';
import {Container} from 'ui';

export const metadata = {
  title: 'Sign up | WannaGo',
};

export const runtime = 'edge';
export const preferredRegion = 'iad1';

export default function RegisterPage() {
  return (
    <Container maxSize="xs">
      <SignUp />
    </Container>
  );
}
