import {prisma} from 'database';
import {NextApiRequest, NextApiResponse} from 'next';
import {getImageMetaData} from '../../utils/getImageMetaData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const allEvents = await prisma.event.findMany();

  for (const event of allEvents) {
    if (event.featuredImageSrc) {
      const {height, imageSrcBase64, width} = await getImageMetaData(
        event.featuredImageSrc
      );

      const dbEvent = await prisma.event.findFirst({
        where: {id: event.id},
      });

      if (!dbEvent?.featuredImageHeight && height) {
        await prisma.event.update({
          where: {id: event.id},
          data: {
            featuredImageHeight: height,
          },
        });
      }

      if (!dbEvent?.featuredImageWidth && width) {
        await prisma.event.update({
          where: {id: event.id},
          data: {
            featuredImageWidth: width,
          },
        });
      }

      if (!dbEvent?.featuredImagePreviewSrc && imageSrcBase64) {
        await prisma.event.update({
          where: {id: event.id},
          data: {
            featuredImagePreviewSrc: imageSrcBase64,
          },
        });
      }
    }
  }

  return res.status(200).json({message: 'ok'});
}
