import FormData from 'form-data';
import {randomUUID} from 'crypto';
import axios from 'axios';
import {env} from 'server-env';
import {z} from 'zod';
import sizeOf from 'image-size';
import sharp from 'sharp';

export class ImageUpload {
  async uploadImage(imageBuffer: Buffer) {
    try {
      const resizedImageBuffer = await sharp(imageBuffer)
        .resize(1200)
        .webp()
        .toBuffer();
      const payload = new FormData();

      payload.append('requireSignedURLs', 'false');
      payload.append('file', resizedImageBuffer, randomUUID());

      const response = await axios.post(
        'https://api.cloudflare.com/client/v4/accounts/520ed574991657981b4927dda46f2477/images/v1',
        payload,
        {
          headers: {
            Authorization: `Bearer ${env.CLOUDFLARE_API_KEY}`,
          },
        }
      );

      const url = response?.data?.result?.variants[0] as string;
      const dimensions = sizeOf(resizedImageBuffer);
      const srcBase64 = await sharp(resizedImageBuffer)
        .resize(10)
        .png()
        .toBuffer();
      const imageSrcBase64 =
        'data:image/png;base64,' + srcBase64.toString('base64');
      const data = {
        width: dimensions.width,
        height: dimensions.height,
        imageSrcBase64,
        url,
      };

      const imageSchema = z.object({
        width: z.number(),
        height: z.number(),
        imageSrcBase64: z.string(),
        url: z.string(),
      });
      return imageSchema.parse(data);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
