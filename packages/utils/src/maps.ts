import type {
  GeocodeResponse,
  PlaceAutocompleteResponse,
} from '@googlemaps/google-maps-services-js';
import {getBaseUrl} from './getBaseUrl';

export async function geocode(address: string) {
  const response = await fetch(`${getBaseUrl()}/api/maps/decode`, {
    method: 'POST',
    body: JSON.stringify({address}),
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error(error);
      return null;
    });

  return response as GeocodeResponse['data'];
}

export async function placeAutocomplete(query: string) {
  const response = await fetch(`${getBaseUrl()}/api/maps/placeAutocomplete`, {
    method: 'POST',
    body: JSON.stringify({query}),
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error(error);
      return null;
    });

  return response as PlaceAutocompleteResponse['data'];
}
