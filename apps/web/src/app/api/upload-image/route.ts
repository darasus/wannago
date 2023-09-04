import {captureException} from '@sentry/nextjs';
import {TRPCError} from '@trpc/server';
import {invariant} from 'utils';
import {ImageUpload} from 'lib/src/ImageUpload';

const {uploadImage} = new ImageUpload();

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    for (const entry of Array.from(data.entries())) {
      const [key, value] = entry;
      const isFile = typeof value == 'object';

      if (isFile) {
        const blob = value as Blob;
        // const filename = blob.name;
        const buffer = Buffer.from(await blob.arrayBuffer());
        const uploadedImage = await uploadImage(buffer);

        invariant(
          uploadedImage,
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Could not upload image',
          })
        );

        return new Response(JSON.stringify(uploadedImage), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }
    }
  } catch (error) {
    console.log(error);
    captureException(error);
    return new Response('Something went wrong', {
      status: 400,
    });
  }
}
