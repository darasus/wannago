import {Img} from '@react-email/components';

export function Logo() {
  const height = 70;
  const width = 152;
  const ratio = 0.5;

  return (
    <Img
      src="https://www.wannago.app/logo-dark.png"
      alt="WannaGo logo"
      width={width * ratio}
      height={height * ratio}
    />
  );
}
