import {Hr} from '@react-email/components';
import {hr} from './shared';
import {Link} from './Link';
import {Section} from './Section';
import {getBaseUrl, getConfig} from 'utils';

export function Footer() {
  return (
    <Section style={{textAlign: 'center'}}>
      <Hr style={hr} />
      <Link href={getBaseUrl()}>{getConfig().name}</Link>
    </Section>
  );
}
