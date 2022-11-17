import {z} from 'zod';

export const CreateEventInput = z.object({
  title: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  address: z.string(),
});
