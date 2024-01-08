import data from '../../../wannago.config.json';
import {z} from 'zod';

export function getConfig() {
  return z
    .object({
      name: z.string(),
      email: z.string().email(),
    })
    .parse(data);
}
