import {Img} from '@react-email/components';

export function Logo() {
  const ratio = 0.5;
  const height = 100 * ratio;
  const width = 152 * ratio;

  return (
    <Img
      src="https://www.wannago.app/logo.png"
      alt="WannaGo logo"
      width={width}
      height={height}
    />
  );
}
