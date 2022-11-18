import {getAuth} from '@clerk/nextjs/server';
import {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '../../lib/prisma';
import {DeleteEventInput, EventOutput} from '../../model';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method Not Allowed'});
  }

  const {userId} = getAuth(req);

  if (!userId) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  const {id} = DeleteEventInput.parse(JSON.parse(req.body));

  const response = await prisma.event.delete({
    where: {
      id,
    },
  });

  const event = EventOutput.parse(response);

  res.status(200).json(event);
}
