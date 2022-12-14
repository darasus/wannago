import {ImageResponse} from '@vercel/og';
import {NextRequest} from 'next/server';
import {prisma} from '../../lib/prisma';

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
    fetch(new URL('../../public/inter-bold.ttf', import.meta.url)).then(res =>
      res.arrayBuffer()
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
        tw="flex w-full h-full flex-col"
        style={{
          backgroundImage: `url(${event?.featuredImageSrc!})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div tw="flex flex-col px-8 py-4 mt-8 ml-8 bg-white rounded-xl leading-none">
          <span
            style={{
              fontSize: 60,
              marginBottom: 4,
              fontFamily: 'Body',
            }}
          >{`${event?.title}`}</span>
        </div>
        <div
          tw="flex absolute right-5 bottom-5 flex-col bg-gray-800 rounded-xl py-4 px-6 text-slate-100 uppercase leading-none text-left text-6xl"
          style={{fontFamily: 'Logo'}}
        >
          <div>wanna</div>
          <div>go</div>
        </div>
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
