import {getAuth} from '@clerk/nextjs/server';
import {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '../../lib/prisma';
import {CreateEventInput, EventOutput} from '../../model';

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

  const {
    title,
    description,
    startDate,
    endDate,
    address,
    maxNumberOfAttendees,
  } = CreateEventInput.parse(JSON.parse(req.body));

  const response = await prisma.event.create({
    data: {
      title: title,
      description: description,
      endDate: new Date(startDate).toISOString(),
      startDate: new Date(endDate).toISOString(),
      address: address,
      authorId: userId,
      maxNumberOfAttendees: maxNumberOfAttendees,
    },
  });

  const event = EventOutput.parse(response);

  res.status(200).json(event);
}
