import type {
  GeocodeResponse,
  PlaceAutocompleteResponse,
} from '@googlemaps/google-maps-services-js';

export async function geocode(address: string) {
  const response = await fetch(`/api/maps/decode`, {
    method: 'POST',
    body: JSON.stringify({address}),
  }).then((res) => res.json());

  return response as GeocodeResponse['data'];
}

export async function placeAutocomplete(query: string) {
  const response = await fetch(`/api/maps/placeAutocomplete`, {
    method: 'POST',
    body: JSON.stringify({query}),
  }).then((res) => res.json());

  return response as PlaceAutocompleteResponse['data'];
}
