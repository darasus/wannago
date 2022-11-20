import {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '../../../lib/prisma';
import {EventOutput, GetEventInput} from '../../../model';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({error: 'Method Not Allowed'});
  }

  const {id} = GetEventInput.parse(req.query);

  const response = await prisma.event.findFirst({
    where: {
      id,
    },
  });

  const event = EventOutput.parse(response);

  res.status(200).json(event);
}
