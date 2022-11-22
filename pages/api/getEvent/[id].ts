import {NextRequest} from 'next/server';
import {z} from 'zod';
import {prisma} from '../../../lib/prisma';
import {EventOutput} from '../../../model';

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({error: 'Method Not Allowed'}), {
      status: 405,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  const {searchParams} = new URL(req.url);
  const id = searchParams.get('id');

  z.string().min(1).parse(id);

  const response = await prisma.event.findFirst({
    where: {
      id: id!,
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
