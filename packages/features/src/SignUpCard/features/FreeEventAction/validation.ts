import {z} from 'zod';

export const validation = z.object({
  hasPlusOne: z.boolean(),
  code: z.string(),
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  email: z.string().email(),
});

export const validationWithCode = validation.extend({
  code: z.string().min(1),
});

export type EventSignUpForm = z.infer<typeof validation>;
export type EventSignUpWithCodeForm = z.infer<typeof validationWithCode>;
