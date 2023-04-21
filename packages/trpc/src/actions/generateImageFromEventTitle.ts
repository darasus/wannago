import {getBaseUrl} from 'utils';
import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  eventTitle: z.string(),
});

const imageResponseSchema = z.object({
  height: z.number(),
  width: z.number(),
  url: z.string().url(),
  imageSrcBase64: z.string(),
});

export function generateImageFromEventTitle(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const {eventTitle} = validation.parse(input);

    console.log({eventTitle});

    const response = await fetch(
      `${getBaseUrl()}/api/ai/generate-event-image?prompt=${encodeURI(
        eventTitle
      )}`
    );
    const data = await response.json();

    return imageResponseSchema.parse(data);
  };
}
