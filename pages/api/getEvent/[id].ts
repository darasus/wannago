import {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await prisma.event.findFirst({
    where: {
      id: req.query.id as string,
    },
  });

  res.status(200).json(response);
}
