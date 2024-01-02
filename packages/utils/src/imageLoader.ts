interface Props {
  src: string;
  width: number;
  quality?: number;
}

export function imageLoader({src, width: _width, quality = 70}: Props) {
  const maxWidth = 1240;
  const width = _width > maxWidth ? maxWidth : _width;
  const url = new URL(src);

  url.searchParams.append('width', width.toString());
  url.searchParams.append('quality', quality.toString());

  return url.toString();
}
