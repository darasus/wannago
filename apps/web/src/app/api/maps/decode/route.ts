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

  return new Response(JSON.stringify(response.data), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
