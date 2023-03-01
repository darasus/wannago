import {Hr} from '@react-email/hr';
import {gutter, hr} from './shared';
import {Link} from './Link';
import {Text} from './Text';

export function Footer() {
  return (
    <>
      <Hr style={hr} />
      <Text>Sincerely,</Text>
      <Link href="https://www.wannago.app">WannaGo Team</Link>
      <div style={{textAlign: 'center', marginTop: gutter}}>
        <Text>Powered by WannaGo</Text>
        <Text>
          <Link href="https://www.wannago.app">Website</Link> •{' '}
          <Link href="https://twitter.com/wannagohq">Twitter</Link>
        </Text>
      </div>
    </>
  );
}
