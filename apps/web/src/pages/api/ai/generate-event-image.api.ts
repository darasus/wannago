import {NextApiRequest, NextApiResponse} from 'next';
import FormData from 'form-data';
import {randomUUID} from 'crypto';
import got from 'got';
import {env} from 'server-env';
import {getImageMetaData} from 'utils';
import {captureException, captureMessage} from '@sentry/nextjs';
import {TRPCError} from '@trpc/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prompt = req.query.prompt as string;
  const response = await fetch(
    'https://api.stability.ai/v1/generation/stable-diffusion-xl-beta-v2-2-2/text-to-image',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${env.STABILITY_AI_API_KEY}`,
      },
      body: JSON.stringify({
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
    }
  );
  const data = await response.json();
  captureMessage('Generated image', {
    extra: {
      data: JSON.stringify(data),
    },
  });

  const base64 = data.artifacts?.[0]?.base64;

  if (!base64) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Could not generate image',
    });
  }

  const decoded = base64.replace('data:image/png;base64,', '');
  const imageResp = Buffer.from(decoded, 'base64');

  const payload = new FormData();
  payload.append('requireSignedURLs', 'false');
  payload.append('file', imageResp, randomUUID());

  try {
    captureMessage('Uploading image', {
      extra: {
        payload: JSON.stringify(payload),
      },
    });
    const response = (await got
      .post(
        'https://api.cloudflare.com/client/v4/accounts/520ed574991657981b4927dda46f2477/images/v1',
        {
          body: payload,
          headers: {
            Authorization: `Bearer ${env.CLOUDFLARE_API_KEY}`,
          },
        }
      )
      .json()) as any;

    captureMessage('Uploaded image', {
      extra: {
        response: JSON.stringify(response),
      },
    });

    const url = response?.result?.variants[0] as string;
    const {height, width, imageSrcBase64} = await getImageMetaData(url);

    res.status(200).json({url, imageSrcBase64, height, width});
  } catch (error) {
    captureException(error);
    res.status(400).json(error);
  }
}
