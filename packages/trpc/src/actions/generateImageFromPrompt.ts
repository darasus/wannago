import {captureMessage} from '@sentry/nextjs';
import {z} from 'zod';
import {ActionContext} from '../context';
import axios from 'axios';
import {TRPCError} from '@trpc/server';
import {env} from 'server-env';
import {ImageUpload} from 'lib';

const validation = z.object({
  prompt: z.string(),
});

const {uploadImage} = new ImageUpload();

export function generateImageFromPrompt(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    captureMessage('generateImageFromPrompt', {
      extra: {
        input: JSON.stringify(input),
      },
    });
    const {prompt} = validation.parse(input);
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-beta-v2-2-2/text-to-image',
      JSON.stringify({
        cfg_scale: 7,
        clip_guidance_preset: 'FAST_BLUE',
        height: 512,
        width: 512,
        sampler: 'K_DPM_2_ANCESTRAL',
        samples: 1,
        steps: 75,
        text_prompts: [
          {
            text: prompt,
            weight: 1,
          },
        ],
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${env.STABILITY_AI_API_KEY}`,
        },
      }
    );

    const base64 = response.data.artifacts?.[0]?.base64;

    if (!base64) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not generate image',
      });
    }

    const decoded = base64.replace('data:image/png;base64,', '');
    const imageBuffer = Buffer.from(decoded, 'base64');
    const uploadedImage = await uploadImage(imageBuffer);

    if (!uploadedImage) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not upload image',
      });
    }

    return uploadedImage;
  };
}
