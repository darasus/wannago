import {TRPCError} from '@trpc/server';
import {invariant} from 'utils';
import {NextResponse} from 'next/server';
import FormData from 'form-data';
import {randomUUID} from 'crypto';
import {z} from 'zod';
import sizeOf from 'image-size';
import sharp from 'sharp';
import {put} from '@vercel/blob';

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    for (const entry of Array.from(data.entries())) {
      const [, value] = entry;
      const isFile = typeof value == 'object';

      if (isFile) {
        const blob = value as Blob;
        const buffer = Buffer.from(await blob.arrayBuffer());
        const uploadedImage = await uploadImage(buffer);

        invariant(
          uploadedImage,
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Could not upload image',
          })
        );

        return NextResponse.json(uploadedImage);
      }
    }
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  } catch (error) {
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
}

async function uploadImage(imageBuffer: Buffer) {
  try {
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(1200)
      .webp()
      .toBuffer();
    const payload = new FormData();
    const filename = randomUUID();
    payload.append('requireSignedURLs', 'false');
    payload.append('file', resizedImageBuffer, filename);

    const blob = await put(filename, resizedImageBuffer, {
      contentType: 'image/webp',
      access: 'public',
    });

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
      url: blob.url,
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
