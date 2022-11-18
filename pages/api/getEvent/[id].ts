import {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '../../../lib/prisma';
import {GetEventInput} from '../../../model';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id} = GetEventInput.parse(req.query);

  const response = await prisma.event.findFirst({
    where: {
      id,
    },
  });

  const event = GetEventInput.parse(response);

  res.status(200).json(event);
}
