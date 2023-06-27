import {NextResponse} from 'next/server';
import {Client as GoogleMapsClient} from '@googlemaps/google-maps-services-js';
import {env} from 'server-env';
import {invariant} from 'utils';

export async function GET(req: Request) {
  const {query} = await req.json();

  invariant(typeof query === 'string', '`query` must be a string');

  const googleMaps = new GoogleMapsClient();
  const response = googleMaps.placeAutocomplete({
    params: {
      key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      input: query,
    },
  });

  return NextResponse.json(response);
}
