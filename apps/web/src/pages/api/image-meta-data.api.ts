import got from 'got';
import {NextApiRequest, NextApiResponse} from 'next';
import {z} from 'zod';
import sizeOf from 'image-size';
import sharp from 'sharp';
import {captureMessage} from '@sentry/nextjs';

const scheme = z.object({
  imageSrc: z.string().url(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  captureMessage('Generating image metadata', {
    extra: {
      body: JSON.stringify(req.body),
    },
  });

  const {imageSrc} = scheme.parse(JSON.parse(req.body));

  const image = await got(imageSrc).buffer();

  const dimensions = sizeOf(image);

  const srcBase64 = await sharp(image).resize(10).png().toBuffer();
  const imageSrcBase64 =
    'data:image/png;base64,' + srcBase64.toString('base64');

  const data = {
    width: dimensions.width,
    height: dimensions.height,
    imageSrcBase64,
  };

  captureMessage('Generating image metadata', {
    extra: {
      data: JSON.stringify(data),
    },
  });

  return res.status(200).json(data);
}
