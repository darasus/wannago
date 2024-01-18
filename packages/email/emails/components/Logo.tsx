import {Img} from '@react-email/components';
import {config} from 'config';

export function Logo() {
  const height = 70;
  const width = 152;
  const ratio = 0.5;

  return (
    <Img
      src={config.logoSrc}
      alt={`${config.name} logo`}
      width={width * ratio}
      height={height * ratio}
    />
  );
}
