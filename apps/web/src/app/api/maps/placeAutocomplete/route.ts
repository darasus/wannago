import {Client as GoogleMapsClient} from '@googlemaps/google-maps-services-js';
import {env} from 'env/server';
import {invariant} from 'utils';

export async function POST(req: Request) {
  const {query} = await req.json();

  invariant(typeof query === 'string', '`query` must be a string');

  const googleMaps = new GoogleMapsClient();
  const response = await googleMaps.placeAutocomplete({
    params: {
      key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      input: query,
    },
  });

  return new Response(JSON.stringify(response.data), {
    status: 200,
  });
}
