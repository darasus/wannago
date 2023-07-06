import {Currency} from '@prisma/client';

const map: Record<Currency, '$' | '€' | '£'> = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
};

export function getCurrencySymbol(currency: Currency) {
  return map[currency];
}
