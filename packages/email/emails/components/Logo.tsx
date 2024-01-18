import {Img} from '@react-email/components';
import {getConfig} from 'utils';

export function Logo() {
  const height = 70;
  const width = 152;
  const ratio = 0.5;

  return (
    <Img
      src={getConfig().logoSrc}
      alt={`${getConfig().name} logo`}
      width={width * ratio}
      height={height * ratio}
    />
  );
}
