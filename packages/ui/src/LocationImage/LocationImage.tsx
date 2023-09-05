import Image from 'next/image';

interface Props {
  address: string;
  width?: number;
  height?: number;
  longitude: number;
  latitude: number;
  key: string;
}

const width = 480;
const height = 150;
const url = new URL('https://maps.googleapis.com/maps/api/staticmap');
url.searchParams.set('size', `${width}x${height}`);
url.searchParams.set('zoom', '17');
url.searchParams.set('maptype', 'roadmap');
url.searchParams.set('scale', '2');
url.searchParams.set('format', 'jpg');

export function LocationImage({address, longitude, latitude, key}: Props) {
  url.searchParams.set('key', key);
  url.searchParams.set('center', address);
  url.searchParams.set('markers', `color:red|${latitude},${longitude}`);

  return (
    <>
      <DarkImage src={url.toString()} />
      <LightImage src={url.toString()} />
    </>
  );
}

function DarkImage({src}: {src: string}) {
  const url = new URL(src);

  darkStyles.forEach((style) => {
    url.searchParams.append('style', style);
  });

  return (
    <div className="hidden dark:block relative rounded-md overflow-hidden border bg-muted dark:bg-white/[.04] h-24">
      <Image
        src={url.toString()}
        alt={'location'}
        fill
        style={{objectFit: 'cover'}}
        sizes="320 640 750 1000"
        priority
      />
    </div>
  );
}

function LightImage({src}: {src: string}) {
  const url = new URL(src);

  lightStyles.forEach((style) => {
    url.searchParams.append('style', style);
  });

  return (
    <div className="block dark:hidden relative rounded-md overflow-hidden border bg-muted dark:bg-white/[.04] h-24">
      <Image
        src={url.toString()}
        alt={'location'}
        fill
        style={{objectFit: 'cover'}}
        sizes="320 640 750 1000"
        priority
      />
    </div>
  );
}

const lightStyles = [
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
  'feature:water|element:labels.text.fill|color:0x9e9e9e',
  'size=480x360',
];

const darkStyles = [
  'element:geometry|color:0x212121',
  'element:labels.icon|visibility:off',
  'element:labels.text.fill|color:0x757575',
  'element:labels.text.stroke|color:0x212121',
  'feature:administrative|element:geometry|color:0x757575',
  'feature:administrative.country|element:labels.text.fill|color:0x9e9e9e',
  'feature:administrative.land_parcel|visibility:off',
  'feature:administrative.locality|element:labels.text.fill|color:0xbdbdbd',
  'feature:poi|element:labels.text.fill|color:0x757575',
  'feature:poi.park|element:geometry|color:0x181818',
  'feature:poi.park|element:labels.text.fill|color:0x616161',
  'feature:poi.park|element:labels.text.stroke|color:0x1b1b1b',
  'feature:road|element:geometry.fill|color:0x2c2c2c',
  'feature:road|element:labels.text.fill|color:0x8a8a8a',
  'feature:road.arterial|element:geometry|color:0x373737',
  'feature:road.highway|element:geometry|color:0x3c3c3c',
  'feature:road.highway.controlled_access|element:geometry|color:0x4e4e4e',
  'feature:road.local|element:labels.text.fill|color:0x616161',
  'feature:transit|element:labels.text.fill|color:0x757575',
  'feature:water|element:geometry|color:0x000000',
  'feature:water|element:labels.text.fill|color:0x3d3d3d',
  'size=480x360',
];
