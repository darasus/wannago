import {ImageResponse} from '@vercel/og';
import {NextRequest} from 'next/server';

export const config = {
  runtime: 'experimental-edge',
};

const fontResponse = fetch(
  new URL('../../public/paytone-one.ttf', import.meta.url)
).then(res => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const [font] = await Promise.all([fontResponse]);

  return new ImageResponse(
    (
      <div tw="flex flex-col justify-center items-center bg-gray-800 text-gray-100 w-full h-full">
        <span
          tw="text-2xl leading-none text-center"
          style={{
            fontFamily: 'Font',
          }}
        >
          GO
        </span>
      </div>
    ),
    {
      width: 50,
      height: 50,
      fonts: [
        {
          name: 'Font',
          data: font,
          weight: 400,
        },
      ],
    }
  );
}
