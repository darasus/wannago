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

      await prisma.event.update({
        where: {id: event.id},
        data: {
          featuredImageHeight: height,
          featuredImageWidth: width,
          featuredImagePreviewSrc: imageSrcBase64,
        },
      });
    }
  }

  return res.status(200).json({message: 'ok'});
}
