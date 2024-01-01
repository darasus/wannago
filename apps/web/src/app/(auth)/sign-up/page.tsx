import {SignUp} from 'features';
import {Container} from 'ui';

export const metadata = {
  title: 'Sign up | WannaGo',
};

export default function RegisterPage() {
  return (
    <Container maxSize="xs">
      <SignUp />
    </Container>
  );
}
