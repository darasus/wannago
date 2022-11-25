import {NextRequest} from 'next/server';
import {prisma} from '../../lib/prisma';
import {EventOutput} from '../../model';

export default async function handler(req: NextRequest) {
  const userId = req.headers.get('x-user-id');

  if (!userId) {
    return new Response(JSON.stringify({error: 'Unauthorized'}), {
      status: 401,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({error: 'Method Not Allowed'}), {
      status: 405,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  const response = await prisma.event.findMany({
    where: {
      authorId: userId,
    },
  });

  const events = response.map(event => EventOutput.parse(event));

  return new Response(JSON.stringify(events), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}

export const config = {
  runtime: 'experimental-edge',
};
