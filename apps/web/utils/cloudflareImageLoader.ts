interface Props {
  src: string;
  width: number;
  quality?: number;
}

export function cloudflareImageLoader({src, width, quality = 70}: Props) {
  const url = new URL(src);

  url.searchParams.append('width', width.toString());
  url.searchParams.append('quality', quality.toString());

  return url.toString();
}
