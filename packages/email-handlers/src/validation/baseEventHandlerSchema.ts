import {z} from 'zod';
import {EmailType} from '../../../../apps/web/src/types/EmailType';

export const baseEventHandlerSchema = z
  .object({
    type: z.nativeEnum(EmailType),
  })
  .passthrough();
