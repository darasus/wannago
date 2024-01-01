import {z} from 'zod';

export const formScheme = z.object({
  tickets: z.record(z.number()),
  code: z.string().optional(),
});
