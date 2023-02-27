import {z} from 'zod';
import {getBaseUrl} from './getBaseUrl';

export async function getImageMetaData(imageSrc: string) {
  const imageResponse = await fetch(`${getBaseUrl()}/api/image-meta-data`, {
    method: 'POST',
    body: JSON.stringify({imageSrc}),
  });
  const imageSchema = z.object({
    width: z.number(),
    height: z.number(),
    imageSrcBase64: z.string(),
  });
  const imageData = await imageResponse.json();
  const image = imageSchema.parse(imageData);

  return image;
}
