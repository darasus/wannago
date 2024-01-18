import {Hr} from '@react-email/components';
import {hr} from './shared';
import {Link} from './Link';
import {Section} from './Section';
import {getBaseUrl} from 'utils';
import {config} from 'config';

export function Footer() {
  return (
    <Section style={{textAlign: 'center'}}>
      <Hr style={hr} />
      <Link href={getBaseUrl()}>{config.name}</Link>
    </Section>
  );
}
