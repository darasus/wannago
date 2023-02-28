import {
  Client,
  GeocodeResponseData,
  PlaceAutocompleteResponseData,
} from '@googlemaps/google-maps-services-js';
import {getBaseUrl} from 'utils';

export const googleMaps = new Client();

export class Maps {
  async suggestPlaces({
    query,
  }: {
    query: string;
  }): Promise<PlaceAutocompleteResponseData> {
    return fetch(`${getBaseUrl()}/api/maps/suggest-place`, {
      method: 'POST',
      body: JSON.stringify({
        query,
      }),
    }).then(res => res.json());
  }

  async geocode({address}: {address: string}): Promise<GeocodeResponseData> {
    return fetch(`${getBaseUrl()}/api/maps/geocode`, {
      method: 'POST',
      body: JSON.stringify({
        address,
      }),
    }).then(res => res.json());
  }
}
