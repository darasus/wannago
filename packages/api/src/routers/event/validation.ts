import { z } from "zod";

export const eventInput = z.object({
  createdById: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().default(null),
  startDate: z.date(),
  endDate: z.date(),
  address: z.string(),
  featuredImageSrc: z.string().nullable().default(null),
  featuredImageHeight: z.number().nullable().default(null),
  featuredImageWidth: z.number().nullable().default(null),
  featuredImagePreviewSrc: z.string().nullable().default(null),
  maxNumberOfAttendees: z
    .number()
    .or(z.string())
    .transform((val): number => {
      if (typeof val === "number") {
        return val;
      }
      return isNaN(Number(val)) ? 0 : Number(val);
    })
    .nullable()
    .default(Infinity),
  tickets: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      price: z.number(),
      maxQuantity: z.number(),
      id: z.string().optional(),
    })
  ),
});
