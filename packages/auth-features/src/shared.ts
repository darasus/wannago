import {ClerkAPIError} from '@clerk/types';
import {z} from 'zod';

export interface APIResponseError {
  errors: ClerkAPIError[];
}

export const emailFormScheme = z.object({
  email: z.string().email(),
});

export const codeFormScheme = z.object({
  code: z.string().length(6),
});

export const infoFormScheme = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
});

export function parseError(err: APIResponseError): string {
  if (!err) {
    return '';
  }

  if (err.errors) {
    return err.errors[0].longMessage || '';
  }

  throw err;
}
