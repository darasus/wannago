import data from '../../../wannago.config.json';
import {z} from 'zod';

export function getConfig() {
  return z
    .object({
      name: z.string({
        required_error: `"name" is missing in wannago.config.json`,
      }),
      email: z.string().email(`"email" is missing in wannago.config.json`),
      logoSrc: z.string({
        required_error: `"logoSrc" is missing in wannago.config.json`,
      }),
    })
    .parse(data);
}
