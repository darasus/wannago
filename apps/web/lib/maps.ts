import {
  Client,
  PlaceAutocompleteResponse,
  PlaceAutocompleteResponseData,
} from '@googlemaps/google-maps-services-js';
import {getBaseUrl} from '../utils/getBaseUrl';

export const googleMaps = new Client();

export class Maps {
  async suggestPlace({
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
}
