import {getAuth} from '@clerk/nextjs/server';
import {NextRequest} from 'next/server';
import {prisma} from '../../lib/prisma';
import {DeleteEventInput, EventOutput} from '../../model';

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

  const {id} = DeleteEventInput.parse(body);

  const response = await prisma.event.delete({
    where: {
      id,
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
