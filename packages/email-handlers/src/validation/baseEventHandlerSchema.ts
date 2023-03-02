import {z} from 'zod';
import {EmailType} from '@prisma/client';

export const baseEventHandlerSchema = z
  .object({
    type: z.nativeEnum(EmailType),
  })
  .passthrough();
