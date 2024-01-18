import {z} from 'zod';
import {getBaseUrl} from '../../utils/src/getBaseUrl';

const validation = z.object({
  name: z.string({
    required_error: `"name" is missing in wannago.config.json`,
  }),
  email: z.string().email(`"email" is missing in wannago.config.json`),
  logoSrc: z
    .string({
      required_error: `"logoSrc" is missing in wannago.config.json`,
    })
    .transform((val) => {
      try {
        const url = new URL(getBaseUrl());

        url.pathname = val.startsWith('/') ? val : `/${val}`;

        return url.toString();
      } catch (error) {
        return val;
      }
    }),
  twitterLink: z
    .string({
      required_error: `"twitterLink" is missing in wannago.config.json`,
    })
    .url(`"twitterLink" is not a valid URL`),
});

export function validateConfig(config: unknown) {
  return validation.parse(config);
}

export type Config = z.infer<typeof validation>;
