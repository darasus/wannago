import {z} from 'zod';

export const baseScheme = z
  .object({
    type: z.string(),
    // type: z.enum([
    //   'user.created',
    //   'user.updated',
    //   'user.deleted',
    //   'email.created',
    // ]),
  })
  .passthrough();

export type Input = z.infer<typeof baseScheme>;

export const user = {
  created: baseScheme.extend({
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
  }),
  updated: baseScheme.extend({
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
  }),
  deleted: baseScheme.extend({
    data: z.object({
      id: z.string(),
      deleted: z.boolean(),
    }),
  }),
};

export const email = {
  created: baseScheme.extend({
    data: z.object({
      subject: z.string(),
      to_email_address: z.string(),
      data: z.object({
        otp_code: z.string(),
      }),
    }),
  }),
};

export const organization = {
  created: baseScheme.extend({
    data: z.object({
      id: z.string(),
      name: z.string(),
      object: z.enum(['organization']),
      logo_url: z.string().url().nullable(),
      created_by: z.string(),
    }),
  }),
  updated: baseScheme.extend({
    data: z.object({
      id: z.string(),
      name: z.string(),
      object: z.enum(['organization']),
      logo_url: z.string().url(),
      created_by: z.string(),
    }),
  }),
  deleted: baseScheme.extend({
    data: z.object({
      id: z.string(),
      object: z.enum(['organization']),
      deleted: z.boolean(),
    }),
  }),
};
