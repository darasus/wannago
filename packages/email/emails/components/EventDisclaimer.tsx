import {Link} from './Link';
import {Text} from './Text';

interface Props {
  cancelEventUrl: string;
}

export function EventDisclaimer({cancelEventUrl}: Props) {
  return (
    <>
      <Text>
        Or you can cancel you sign up by following this{' '}
        <Link href={cancelEventUrl}>link</Link>.
      </Text>
      <Text>
        {
          "If you didn't sign up to this event, you can safely ignore this email."
        }
      </Text>
    </>
  );
}
