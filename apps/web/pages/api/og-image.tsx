import {ImageResponse} from '@vercel/og';
import {NextRequest} from 'next/server';
import {prisma} from 'database';
import {ONE_WEEK_IN_SECONDS} from '../../constants';

export const config = {
  runtime: 'edge',
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
    include: {
      organization: {
        include: {
          users: true,
        },
      },
    },
  });

  const maxTitleLength = 100;

  const title =
    event?.title && event?.title.length > maxTitleLength
      ? `${event?.title.slice(0, maxTitleLength)}...`
      : event?.title;

  const user = event?.organization?.users[0]!;

  console.log(event?.featuredImageSrc);

  return new ImageResponse(
    (
      <div tw="flex w-full h-full p-8" style={{backgroundColor: '#FFE5D9'}}>
        <div
          tw="flex w-full max-w-full h-full border-4 border-gray-800 p-8 bg-gray-50"
          style={{borderRadius: 50}}
        >
          <div
            tw="flex h-full w-[400px] mr-6 overflow-hidden"
            style={{
              borderRadius: 50,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              tw="w-full h-full"
              src={event?.featuredImageSrc!}
              style={{objectFit: 'cover'}}
              alt=""
            />
          </div>
          <div
            tw="flex text-slate-700 w-full h-full"
            style={{
              fontFamily: 'Body',
            }}
          >
            <div tw="flex flex-col h-full justify-center">
              <div tw="flex items-center mb-8">
                <div tw="flex rounded-full overflow-hidden mr-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    width={70}
                    height={70}
                    src={user.profileImageSrc!}
                    alt="Profile Image"
                  />
                </div>
                <span
                  style={{fontSize: 50}}
                >{`${user.firstName} ${user.lastName}`}</span>
              </div>
              <div tw="flex flex-col max-w-[600px]">
                <span tw="max-w-full leading-[60px]" style={{fontSize: 70}}>
                  {title}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* <div
          tw="flex absolute right-5 bottom-5 flex-col bg-gray-800 rounded-xl py-4 px-6 text-gray-100 uppercase leading-none text-left text-6xl"
          style={{fontFamily: 'Logo'}}
        >
          <div>wanna</div>
          <div>go</div>
        </div> */}
      </div>
    ),
    {
      headers: {
        'Cache-Control': `s-maxage=60, stale-while-revalidate=${ONE_WEEK_IN_SECONDS}`,
      },
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
