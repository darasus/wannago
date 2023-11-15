import {TRPCError} from '@trpc/server';
import {invariant} from 'utils';
import {ImageUpload} from 'lib/src/ImageUpload';
import {NextResponse} from 'next/server';

const {uploadImage} = new ImageUpload();

export const runtime = 'nodejs';

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

        return NextResponse.json(uploadedImage);
      }
    }
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  } catch (error) {
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
}
