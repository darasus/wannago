import {NextResponse} from 'next/server';
import {Client as GoogleMapsClient} from '@googlemaps/google-maps-services-js';
import {env} from 'server-env';
import {invariant} from 'utils';

export async function POST(req: Request) {
  const {address} = await req.json();

  invariant(typeof address === 'string', '`address` must be a string');

  const googleMaps = new GoogleMapsClient();
  const response = await googleMaps.geocode({
    params: {
      key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      address,
    },
  });

  return NextResponse.json(response.data);
}
