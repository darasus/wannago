import {Img} from '@react-email/img';

export function Logo() {
  const ratio = 233 / 121;
  const height = 50;
  const width = height * ratio;

  return (
    <Img
      src="https://www.wannago.app/images/logo_dark.png"
      alt="WannaGo logo"
      width={width}
      height={height}
    />
  );
}
