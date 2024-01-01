import {NewPasswordForm} from 'features';
import {Container} from 'ui';

export default function PasswordResetPage({params}: {params: {token: string}}) {
  return (
    <Container maxSize="xs">
      <NewPasswordForm token={params.token} />
    </Container>
  );
}
