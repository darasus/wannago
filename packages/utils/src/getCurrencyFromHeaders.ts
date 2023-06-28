import {Currency} from '@prisma/client';

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
  countryRegion: string | undefined | null
): Currency | 'USD' {
  if (!countryRegion) {
    return 'USD';
  }

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
