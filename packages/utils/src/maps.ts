import type {
  GeocodeResponse,
  PlaceAutocompleteResponse,
} from '@googlemaps/google-maps-services-js';
import {getBaseUrl} from './getBaseUrl';
import axios from 'axios';
import {captureException} from '@sentry/nextjs';

export async function geocode(address: string) {
  const response = await axios
    .post(`${getBaseUrl()}/api/maps/decode`, {address})
    .then((res) => res.data)
    .catch((error) => {
      captureException(error);
      return null;
    });

  return response as GeocodeResponse['data'];
}

export async function placeAutocomplete(query: string) {
  const response = await axios
    .post(`${getBaseUrl()}/api/maps/placeAutocomplete`, {query})
    .then((res) => res.data)
    .catch((error) => {
      captureException(error);
      return null;
    });

  return response as PlaceAutocompleteResponse['data'];
}
