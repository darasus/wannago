import {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '../../../lib/prisma';
import {EventOutput, GetMyEventsInput} from '../../../model';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {userId} = GetMyEventsInput.parse(req.query);

  if (!userId) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  if (req.method !== 'GET') {
    return res.status(405).json({error: 'Method Not Allowed'});
  }

  const response = await prisma.event.findMany({
    where: {
      authorId: userId,
    },
  });

  const events = response.map(event => EventOutput.parse(event));

  return res.status(200).json(events);
}
