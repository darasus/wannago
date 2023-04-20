import {NextRequest} from 'next/server';
import {ONE_WEEK_IN_SECONDS} from 'const';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const {searchParams} = req.nextUrl;
  const prompt = searchParams.get('prompt');
  const response = await fetch(
    'https://api.stability.ai/v1/generation/stable-diffusion-xl-beta-v2-2-2/text-to-image',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization:
          'Bearer sk-2PsUWRv7tqiyOxh2qQxA8mB5BSrW1Z9wvIhQEM8LVEfLCMXc',
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
  const base64 = data.artifacts[0].base64;

  const decoded = base64.replace('data:image/png;base64,', '');
  const imageResp = new Buffer(decoded, 'base64');

  return new Response(imageResp, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': decoded.length,
      'Cache-Control': `s-maxage=60, stale-while-revalidate=${ONE_WEEK_IN_SECONDS}`,
    },
  });
}
