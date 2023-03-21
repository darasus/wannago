import {z} from 'zod';

export const baseScheme = z
  .object({
    type: z.enum([
      'user.created',
      'user.updated',
      'user.deleted',
      'email.created',
    ]),
  })
  .passthrough();

export const userCreateUpdateScheme = baseScheme.extend({
  data: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    profile_image_url: z.string(),
    primary_email_address_id: z.string(),
    email_addresses: z.array(
      z.object({
        id: z.string(),
        email_address: z.string(),
        verification: z
          .object({
            status: z.enum(['verified']),
          })
          .nullable(),
      })
    ),
  }),
});

export const userDeleteScheme = baseScheme.extend({
  data: z.object({
    id: z.string(),
    deleted: z.boolean(),
  }),
});

export const emailCreateScheme = baseScheme.extend({
  data: z.object({
    subject: z.string(),
    to_email_address: z.string(),
    data: z.object({
      otp_code: z.string(),
    }),
  }),
});
