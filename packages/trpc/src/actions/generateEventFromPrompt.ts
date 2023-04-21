import {TRPCError} from '@trpc/server';
import {parseISO} from 'date-fns';
import {getBaseUrl} from 'utils';
import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  prompt: z.string(),
  firstName: z.string(),
});

export function generateEventFromPrompt(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const {prompt, firstName} = validation.parse(input);

    const url = new URL(`${getBaseUrl()}/api/ai/generate-event`);

    url.searchParams.append('prompt', prompt);
    url.searchParams.append('timezone', ctx.timezone);

    const response = await fetch(url).catch(err => {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Something went wrong. Please try again.`,
      });
    });
    const data = await response.json();
    const responseSchema = z.object({
      output: z.object({
        title: z.string().transform(value => {
          return value
            .replaceAll('{name}', firstName)
            .replaceAll('{Name}', firstName);
        }),
        description: z.string().transform(value => {
          return value
            .replaceAll('{name}', firstName)
            .replaceAll('{Name}', firstName);
        }),
        address: z
          .string({
            required_error: `Doesn't seem like you entered an address. Please try again.`,
          })
          .transform(value => {
            if (value === 'unknown') {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Doesn't seem like you entered location for your event. Please try again.`,
              });
            }

            return value;
          }),
        startDate: z.string().transform(value => {
          if (value === 'unknown') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Doesn't seem like you entered time of your event. Please try again.`,
            });
          }

          return parseISO(value);
        }),
        endDate: z.string().transform(value => {
          if (value === 'unknown') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Doesn't seem like you entered time of your event. Please try again.`,
            });
          }

          return parseISO(value);
        }),
        maxNumberOfAttendees: z.string().transform(value => {
          if (value === 'unknown') {
            return 0;
          }

          const number = isNaN(Number(value)) ? 0 : Number(value);

          return number;
        }),
        imagePrompt: z.string().transform(value => {
          return value
            .replaceAll('{name}', 'person')
            .replaceAll('{Name}', 'person');
        }),
      }),
    });

    const {output} = responseSchema.parse(data);

    return output;
  };
}
