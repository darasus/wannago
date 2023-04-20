import {z} from 'zod';

export const eventInput = z.object({
  title: z.string(),
  description: z.string().nullable().default(null),
  startDate: z.date(),
  endDate: z.date(),
  address: z.string().nullable().default(null),
  featuredImageSrc: z.string().nullable().default(null),
  featuredImageHeight: z.number().nullable().default(null),
  featuredImageWidth: z.number().nullable().default(null),
  featuredImagePreviewSrc: z.string().nullable().default(null),
  maxNumberOfAttendees: z
    .number()
    .or(z.string())
    .transform((val): number => {
      if (typeof val === 'number') {
        return val;
      }
      return Number(val);
    })
    .nullable()
    .default(Infinity),
});
