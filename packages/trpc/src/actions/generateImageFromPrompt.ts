import {captureMessage} from '@sentry/nextjs';
import {getBaseUrl} from 'utils';
import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  prompt: z.string(),
});

const imageResponseSchema = z.object({
  height: z.number(),
  width: z.number(),
  url: z.string().url(),
  imageSrcBase64: z.string(),
});

export function generateImageFromPrompt(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    captureMessage('generateImageFromPrompt', {
      extra: {
        input: JSON.stringify(input),
      },
    });
    const {prompt} = validation.parse(input);

    const response = await fetch(
      `${getBaseUrl()}/api/ai/generate-event-image?prompt=${encodeURI(prompt)}`
    );
    const data = await response.json();

    return imageResponseSchema.parse(data);
  };
}
