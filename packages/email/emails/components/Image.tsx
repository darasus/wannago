import {Section, Img} from '@react-email/components';
import {gutter} from './shared';

interface Props {
  imageSrc: string;
  alt?: string;
}

export function Image({imageSrc, alt}: Props) {
  return (
    <Section
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: gutter,
      }}
    >
      <Img src={imageSrc} alt={alt} style={{display: 'block', width: '100%'}} />
    </Section>
  );
}
