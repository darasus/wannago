import Image from 'next/image';

interface Props {
  address: string;
  width?: number;
  height?: number;
  longitude: number;
  latitude: number;
}

export function GoogleLocationImage({
  width = 500,
  height = 500,
  address,
  longitude,
  latitude,
}: Props) {
  const url = new URL('https://maps.googleapis.com/maps/api/staticmap');

  url.searchParams.set('key', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!);
  url.searchParams.set('size', `${width}x${height}`);
  url.searchParams.set('zoom', '13');
  url.searchParams.set('maptype', 'roadmap');
  url.searchParams.set('center', address);
  url.searchParams.set('scale', '2');
  url.searchParams.set('format', 'jpg');
  url.searchParams.set('visible', 'Amsterdam');
  url.searchParams.set('markers', `color:red|label:S|${latitude},${longitude}`);

  return (
    <div className="rounded-xl overflow-hidden">
      <Image src={url.toString()} alt="" width={width} height={height} />
    </div>
  );
}
