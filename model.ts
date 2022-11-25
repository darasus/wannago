import {z} from 'zod';

const dateType = z
  .string()
  .or(z.date())
  .transform((val): Date => {
    if (val instanceof Date) {
      return val;
    }
    return new Date(val);
  });

export const GetEventInput = z.object({
  id: z
    .string()
    .or(z.array(z.string()))
    .transform((val): string => {
      if (typeof val === 'string') {
        return val;
      }
      return val.join('');
    }),
});

export const EventOutput = z.object({
  id: z.string().uuid(),
  shortId: z.string().nullable().default(''),
  title: z.string(),
  description: z.string(),
  address: z.string(),
  isPublished: z.boolean(),
  authorId: z.string(),
  maxNumberOfAttendees: z.number(),
  startDate: dateType,
  endDate: dateType,
  createdAt: dateType,
  updatedAt: dateType,
});

export const EditEventInput = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  address: z.string(),
  maxNumberOfAttendees: z
    .number()
    .or(z.string())
    .transform((val): number => {
      if (typeof val === 'number') {
        return val;
      }
      return Number(val);
    }),
});

export const CreateEventInput = z.object({
  title: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  address: z.string(),
  maxNumberOfAttendees: z
    .number()
    .or(z.string())
    .transform((val): number => {
      if (typeof val === 'number') {
        return val;
      }
      return Number(val);
    }),
});

export const DeleteEventInput = z.object({
  id: z.string(),
});

export const GetMyEventsInput = z.object({
  userId: z.string(),
});
