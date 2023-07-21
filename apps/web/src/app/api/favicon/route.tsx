import {ImageResponse} from '@vercel/og';
import {getBaseUrl} from 'utils';

export const runtime = 'edge';

const fontResponse = fetch(
  new URL(`${getBaseUrl()}/paytone-one.ttf`, import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET() {
  const [font] = await Promise.all([fontResponse]);

  return new ImageResponse(
    (
      <div tw="flex flex-col justify-center items-center bg-[#09090b] text-gray-100 w-full h-full">
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
      headers: {
        'Content-Type': 'image/png',
        // 'Cache-Control': 'max-age=60, stale-while-revalidate',
      },
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
