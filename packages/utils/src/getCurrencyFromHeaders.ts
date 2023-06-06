import {Currency} from '@prisma/client';
import {IncomingHttpHeaders} from 'http2';

const usdRegions = ['US', 'TL', 'EC', 'SV', 'FM', 'MH', 'PW', 'PA', 'ZW'];
const eurRegions = [
  'AT',
  'BE',
  'CY',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PT',
  'SK',
  'SI',
  'ES',
];
const gbpRegions = ['GB', 'GG', 'IM', 'JE'];

export function getCurrencyFromHeaders(
  headers: IncomingHttpHeaders | undefined
): Currency | 'USD' {
  if (!headers) {
    return 'USD';
  }

  const countryRegion = headers['x-vercel-ip-country'] as string;

  if (usdRegions.includes(countryRegion)) {
    return 'USD';
  }

  if (eurRegions.includes(countryRegion)) {
    return 'EUR';
  }

  if (gbpRegions.includes(countryRegion)) {
    return 'GBP';
  }

  return 'USD';
}
