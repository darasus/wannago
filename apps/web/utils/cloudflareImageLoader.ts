interface Props {
  src: string;
  width: number;
  quality?: number;
}

export function cloudflareImageLoader({src, width, quality}: Props) {
  const params = [`width=${width}`];

  if (quality) {
    params.push(`quality=${quality}`);
  }

  const paramsString = params.join(',');

  return `${src}?${paramsString}`;
}
