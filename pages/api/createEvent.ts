import {getAuth} from '@clerk/nextjs/server';
import {NextRequest} from 'next/server';
import {prisma} from '../../lib/prisma';
import {CreateEventInput, EventOutput} from '../../model';
import {nanoid} from 'nanoid';

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({error: 'Method Not Allowed'}), {
      status: 405,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  const {userId} = getAuth(req);

  if (!userId) {
    return new Response(JSON.stringify({error: 'Unauthorized'}), {
      status: 401,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  const body = await req.json();

  const {
    title,
    description,
    startDate,
    endDate,
    address,
    maxNumberOfAttendees,
  } = CreateEventInput.parse(body);

  const response = await prisma.event.create({
    data: {
      shortId: nanoid(),
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

  return new Response(JSON.stringify(event), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
