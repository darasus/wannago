import {Hr} from '@react-email/hr';
import {gutter, hr} from './shared';
import {Link} from './Link';
import {Text} from './Text';
import {Section} from './Section';

export function Footer() {
  return (
    <Section style={{textAlign: 'center'}}>
      <Hr style={hr} />
      <Text style={{textAlign: 'center'}}>Sincerely,</Text>
      <Link href="https://www.wannago.app">WannaGo Team</Link>
      <div style={{textAlign: 'center', marginTop: gutter}}>
        <Text style={{textAlign: 'center'}}>Powered by WannaGo</Text>
        <Text style={{textAlign: 'center'}}>
          <Link href="https://www.wannago.app">Website</Link> •{' '}
          <Link href="https://twitter.com/wannagohq">Twitter</Link>
        </Text>
      </div>
    </Section>
  );
}
