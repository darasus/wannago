import {env} from 'client-env';
import Image from 'next/image';

interface Props {
  address: string;
  width?: number;
  height?: number;
  longitude: number;
  latitude: number;
}

export function LocationImage({
  width = 500,
  height = 500,
  address,
  longitude,
  latitude,
}: Props) {
  const url = new URL('https://maps.googleapis.com/maps/api/staticmap');

  url.searchParams.set('key', env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!);
  url.searchParams.set('size', `${width}x${height}`);
  url.searchParams.set('zoom', '18');
  url.searchParams.set('maptype', 'roadmap');
  url.searchParams.set('center', address);
  url.searchParams.set('scale', '2');
  url.searchParams.set('format', 'jpg');
  url.searchParams.set('markers', `color:red|${latitude},${longitude}`);

  styles.forEach(style => {
    url.searchParams.append('style', style);
  });

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-gray-200">
      <Image src={url.toString()} alt="" width={width} height={height} />
    </div>
  );
}

const styles = [
  'element:geometry|color:0xf5f5f5',
  'element:labels.icon|visibility:off',
  'element:labels.text.fill|color:0x616161',
  'element:labels.text.stroke|color:0xf5f5f5',
  'feature:administrative.land_parcel|element:labels.text.fill|color:0xbdbdbd',
  'feature:poi|element:geometry|color:0xeeeeee',
  'feature:poi|element:labels.text.fill|color:0x757575',
  'feature:poi.park|element:geometry|color:0xe5e5e5',
  'feature:poi.park|element:labels.text.fill|color:0x9e9e9e',
  'feature:road|element:geometry|color:0xffffff',
  'feature:road.arterial|element:labels.text.fill|color:0x757575',
  'feature:road.highway|element:geometry|color:0xdadada',
  'feature:road.highway|element:labels.text.fill|color:0x616161',
  'feature:road.local|element:labels.text.fill|color:0x9e9e9e',
  'feature:transit.line|element:geometry|color:0xe5e5e5',
  'feature:transit.station|element:geometry|color:0xeeeeee',
  'feature:water|element:geometry|color:0xc9c9c9',
  'feature:water|element:labels.text.fill|color:0x9e9e9e&size=480x360',
];
