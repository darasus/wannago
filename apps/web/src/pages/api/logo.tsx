import {ImageResponse} from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const fontResponse = fetch(
  new URL('../../../public/paytone-one.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

export default async function handler() {
  const [font] = await Promise.all([fontResponse]);

  return new ImageResponse(
    (
      <div tw="flex flex-col justify-center items-start bg-[#09090b] text-gray-100 w-full h-full p-4 uppercase rounded-xl">
        <span
          tw="text-[30px] leading-none text-center"
          style={{
            fontFamily: 'Font',
          }}
        >
          wanna
        </span>
        <span
          tw="text-[30px] leading-none text-center"
          style={{
            fontFamily: 'Font',
          }}
        >
          go
        </span>
      </div>
    ),
    {
      width: 152,
      height: 100,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'max-age=60, stale-while-revalidate',
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
