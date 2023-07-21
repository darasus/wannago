import {ImageResponse} from '@vercel/og';
import {NextRequest} from 'next/server';
import {ONE_WEEK_IN_SECONDS} from 'const';
import {getBaseUrl, invariant} from 'utils';
import {captureException} from '@sentry/nextjs';
import clip from 'text-clipper';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const {searchParams} = req.nextUrl;
    const title = searchParams.get('title');
    const organizerName = searchParams.get('organizerName');
    const eventImageUrl = searchParams.get('eventImageUrl');
    const organizerProfileImageUrl = searchParams.get(
      'organizerProfileImageUrl'
    );

    invariant(title, 'Missing title');
    invariant(organizerName, 'Missing organizerName');
    invariant(eventImageUrl, 'Missing eventImageUrl');

    const [logoFontData, bodyFontData] = await Promise.all([
      fetch(new URL(`${getBaseUrl()}/paytone-one.ttf`, import.meta.url)).then(
        (res) => res.arrayBuffer()
      ),
      fetch(
        new URL(`${getBaseUrl()}/dm-serif-display.ttf`, import.meta.url)
      ).then((res) => res.arrayBuffer()),
    ]);

    const trimmedTitle = clip(title, 80);
    const trimmedOrganizerName = clip(organizerName, 20);

    return new ImageResponse(
      (
        <div tw="flex w-full h-full p-8 bg-white">
          <div
            tw="flex w-full max-w-full h-full border-4 border-[#09090b] p-8 bg-white"
            style={{borderRadius: 20}}
          >
            <div
              tw="flex h-full w-[400px] mr-6 overflow-hidden"
              style={{
                borderRadius: 20,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                tw="w-full h-full"
                src={decodeURIComponent(atob(eventImageUrl))}
                style={{objectFit: 'cover'}}
                alt=""
              />
            </div>
            <div
              tw="flex text-[#09090b] w-full h-full"
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
                      src={decodeURIComponent(atob(organizerProfileImageUrl!))}
                      alt="Profile Image"
                    />
                  </div>
                  <span style={{fontSize: 50}}>{trimmedOrganizerName}</span>
                </div>
                <div tw="flex flex-col max-w-[600px]">
                  <span tw="max-w-full leading-[60px]" style={{fontSize: 70}}>
                    {trimmedTitle}
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
  } catch (error) {
    captureException(error);
    return null;
  }
}
