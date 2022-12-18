import {ImageResponse} from '@vercel/og';
import {NextRequest} from 'next/server';
import {prisma} from '../../../../packages/database/prisma';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  const {searchParams} = req.nextUrl;
  const eventId = searchParams.get('eventId');
  const [logoFontData, bodyFontData] = await Promise.all([
    fetch(new URL('../../public/paytone-one.ttf', import.meta.url)).then(res =>
      res.arrayBuffer()
    ),
    fetch(new URL('../../public/dm-serif-display.ttf', import.meta.url)).then(
      res => res.arrayBuffer()
    ),
  ]);

  if (!eventId) {
    throw new Error('Missing eventId');
  }

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  return new ImageResponse(
    (
      <div
        tw="flex w-full h-full flex-col p-8"
        style={{backgroundColor: '#FFE5D9'}}
      >
        <div
          tw="flex w-full h-full border-4 border-gray-700 flex-col p-8 bg-gray-50"
          style={{borderRadius: 50}}
        >
          <div
            tw="flex grow w-full mb-6"
            style={{
              backgroundImage: `url(${event?.featuredImageSrc!})`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              borderRadius: 50,
            }}
          />
          <div tw="flex flex-col rounded-xl leading-none text-slate-800">
            <span
              style={{
                fontSize: 80,
                marginBottom: 4,
                fontFamily: 'Body',
              }}
            >{`${event?.title}`}</span>
          </div>
        </div>
        {/* <div
          tw="flex absolute right-5 bottom-5 flex-col bg-gray-800 rounded-xl py-4 px-6 text-slate-100 uppercase leading-none text-left text-6xl"
          style={{fontFamily: 'Logo'}}
        >
          <div>wanna</div>
          <div>go</div>
        </div> */}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Logo',
          data: logoFontData,
          weight: 500,
        },
        {
          name: 'Body',
          data: bodyFontData,
          weight: 300,
        },
      ],
    }
  );
}
